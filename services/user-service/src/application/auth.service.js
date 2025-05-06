const { generateTokenPair, verifyJWT, createAccessToken, createResetToken } = require('../domain/token');
const bcrypt = require('bcrypt');
const RepositoryFactory = require("../infratructure/repository/repositoryFactory")
const { UnauthorizedError, NotFoundError, ForbiddenError, InternalServerError, BadGatewayError, BadRequestError, ConflictError } = require("../shared/cores/error.response")
const { v4: uuidv4 } = require("uuid");
const { getInfoData } = require('../shared/utils/index');
const { runProducer } = require('../infratructure/rabbitmq/rabbitmq');
const { OAuth2Client } = require("google-auth-library");
const RedisService = require('./redis.service');
const Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const ClientId = process.env.GOOGLE_CLIENT_ID
const refreshSecretKey = process.env.REFRESH_SECRET
class AuthService {
    static async signUp({ name, email, password }) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('Email is already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserRepository.createUser({ name, email, password: hashedPassword });
        const tokens = generateTokenPair({ userId: user.id });
        const topic = 'user.created'
        const message = {
            UserId: user.id,
        }
        await runProducer(topic, message, "userEvents", "cartQueue", "userEventsDLX", "userEventsDLX.routingKey")
        return {
            user: getInfoData({
                fields: ["id", "name", "email", "phone", "status", "avatar"],
                object: user,
            }),
            tokens
        };

    }

    static async login({ email, password }) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        if (!email || !password) {
            throw new UnauthorizedError('Email or password is required');
        }
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError("Account not found")
        }
        if (!user.password) {
            throw new UnauthorizedError("Account does not support password login")
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            throw new UnauthorizedError("Email or password incorrect");
        }
        if (user.status !== "active") {
            throw new ForbiddenError("Account is not active");
        }
        const jti = uuidv4();
        const tokens = generateTokenPair({ userId: user.id, jti: jti });
        return {
            user: getInfoData({
                fields: ['id', 'name', 'email', 'phone', 'status', 'avatar'],
                object: user
            }),
            tokens
        };
    }

    static async loginWithGoogle(idToken) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        if (!idToken) {
            throw new UnauthorizedError("An error occured")
        }
        const ticket = await Client.verifyIdToken({
            idToken,
            audience: ClientId
        })
        if (!ticket) {
            throw new UnauthorizedError("Login by google failed")
        }
        const payload = ticket.getPayload()
        const googleId = payload['sub']
        const email = payload('email')
        const name = payload('name')

        let user = UserRepository.findByGoogleId(googleId, email)
        if (!user) {
            user = await UserRepository.createUser({
                googleId,
                email,
                name,
                status: 'actice'
            })
            const topic = 'user.created'
            const message = {
                UserId: user.id,
            }
            await runProducer(topic, message, "userEvents", 'cartQueue', 'userEventsDLX', 'userEventsDLX.routingKey')
        } else if (!user.googleId) {
            user.googleId = googleId
            user.save()
        }
        if (user.status !== 'active') {
            throw new ForbiddenError("Account is not active")
        }
        const jti = uuidv4();
        const tokens = generateTokenPair({ userId: user.id, jti: jti });
        return {
            user: getInfoData({
                fields: ['id', 'name', 'email', 'phone', 'status', 'avatar'],
                object: user
            }),
            tokens
        };
    }
    static async logout(refreshToken) {
        const decode = verifyJWT(refreshToken, refreshSecretKey)
        const { jti } = decode
        const state = await RedisService.addElementToRedisBloomFilter("blacklist_token", jti)
        if (!state) {
            throw new InternalServerError("Logout failed")
        }
        return state
    }

    static async HandleRefreshToken(refreshToken) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        const decoded = verifyJWT(refreshToken, process.env.REFRESH_SECRET);
        const { userId, jti } = decoded
        const holderUser = await UserRepository.findById(userId)
        if (!holderUser) {
            throw new UnauthorizedError("Something went wrong, please relogin");
        }
        const usedToken = await RedisService.checkElementExistInRedisBloomFilter("blacklist_token", jti)
        if (usedToken) {
            throw new UnauthorizedError("Something went wrong, please relogin");
        }
        const accessToken = createAccessToken({ userId, jti })
        const newTokens = { accessToken, refreshToken }
        return newTokens;
    }
    static async forgotPassword(email) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        const OtpRepository = RepositoryFactory.getRepository("OtpRepository")
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }

        const newOtpValue = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            digits: true, // Đảm bảo chỉ sinh số
        });
        const expireTime = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
        const newOtp = await OtpRepository.createOtp({
            otp_value: newOtpValue,
            UserId: holderUser.id,
            expire: expireTime
        });

        await OtpRepository.createOtp({ otpValue, userId: user.id, expire });
        const topic = 'email.resetPassword';
        const message = {
            email,
            otp: newOtpValue,
            subject: 'Reset Your Password',
            template: 'reset-password',
        };
        await runProducer(topic, message, "userEvents", 'notiQueue', 'userEventsDLX', 'userEventsDLX.routingKey')
        return { otp: newOtpValue };
    }

    static async checkOtp(otp) {
        await RepositoryFactory.initialize()
        const OtpRepository = RepositoryFactory.getRepository("OtpRepository")
        if (!otp) {
            throw new BadGatewayError("OTP is required");
        }
        const holderOtp = await OtpRepository.findByValue(otp);
        if (!holderOtp) {
            throw new NotFoundError("OTP not found");
        }
        if (new Date() > holderOtp.expire) {
            await OtpRepository.deleteOtp(otp);
            throw new UnauthorizedError("OTP has expired. Please request a new one.");
        }
        const userId = holderOtp.UserId;
        const resetToken = createResetToken({ userId: userId });
        await OtpRepository.deleteOtp(otp);
        return { resetToken };
    }
    static async changePassword({ resetToken, newPassword, confirmedPassword }) {
        await RepositoryFactory.initialize()
        const UserRepository = RepositoryFactory.getRepository("UserRepository")
        if (!resetToken || !newPassword || !confirmedPassword) {
            throw new BadRequestError("All fields are required");
        }
        if (newPassword !== confirmedPassword) {
            throw new ConflictError("Confirmed password does not match");
        }
        const decode = verifyJWT(resetToken, accessSecretKey);

        const holderUser = await UserRepository.findById(decode.userId);
        if (!holderUser) {
            throw new NotFoundError("User not found");
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        const result = await UserRepository.updatePassword(decode.userId, hashPassword);
        if (!result || result[0] === 0) {
            throw new BadRequestError("Failed to update password");
        }
        const userId = holderUser.id;
        const jti = uuidv4();
        const tokens = generateTokenPair({ userId, jti });
        return {
            user: getInfoData({
                fields: ["id", "name", "email", "phone", "status", "avatar"],
                object: holderUser
            }),
            tokens
        };
    }
}

module.exports = AuthService;