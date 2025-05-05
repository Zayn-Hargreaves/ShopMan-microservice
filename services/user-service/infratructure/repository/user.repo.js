const { getUnselectData } = require("../../shared/utils/index");
const User = require("../../domain/user"); // Import domain entity User

class UserRepository {
    constructor(models) {
        this.UserModel = models.User;
    }

    async findByEmail(email) {
        const userData = await this.UserModel.findOne({
            where: { email },
            raw: true
        });
        if (!userData) return null;

        return new User(userData);
    }

    async findById(id) {
        const userData = await this.UserModel.findByPk(id, {
            attributes: getUnselectData(['password']),
            raw: true
        });
        if (!userData) return null;

        return new User(userData);
    }

    async findByGoogleId(googleId, email) {
        const userData = await this.UserModel.findOne({
            where: { $or: [{ googleId }, { email }] },
            attributes: getUnselectData(['password']),
            raw: true
        });
        if (!userData) return null;

        return new User(userData);
    }

    async updatePassword(id, password) {
        return await this.UserModel.update({ password }, { where: { id } });
    }

    async createUser({ name, email, password = null, googleId = null, status = 'active' }) {
        const userData = await this.UserModel.create({ name, email, password, status, googleId });

        return new User(userData.get({ plain: true }));
    }

    async updateUserProfile(UserId, { name, phone, avatar }) {
        await this.UserModel.update({
            name,
            phone,
            avatar,
        }, {
            where: {
                id: UserId
            }
        });

        return this.findById(UserId);
    }
}

module.exports = UserRepository;