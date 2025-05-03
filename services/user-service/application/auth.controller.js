const { OkResponse } = require("../shared/cores/success.response")
const AuthService = require("./auth.service")
class AuthController {
    login = async (req, res, next) => {
        const {email, password} = req.body
        new OkResponse({
            message: "login success",
            metadata: await AuthService.login({email,password})
        }).send(res)
    }
    loginWithGoogle = async (req, res, next) => {
        const idToken = req.body.idToken
        new OkResponse({
            message: 'login with google success',
            metadata: await AuthService.loginWithGoogle(idToken)
        }).send(res)
    }
    logout = async (req, res, next) => {
        const refreshToken = req.refreshToken
        new OkResponse({
            message: "logout success",
            metadata: await AuthService.logout(refreshToken)
        }).send(res)
    }
    handleRefreshToken = async(req, res,next)=>{
        const refreshToken = req.refreshToken
        new OkResponse({
            message:"handle refreshToken success",
            metadata:await AuthService.HandleRefreshToken(refreshToken)
        }).send(res)
    }
    signup = async (req, res, next) => {
        const {name, email, password} = req.body
        new OkResponse({
            message: 'sign up success',
            metadata: await AuthService.signUp({name,email,password})
        }).send(res)
    }
    forgotPassword = async (req, res, next) => {
        const email = req.body.email
        new OkResponse({
            message: "get Otp code successfully",
            metadata: await AuthService.forgotPassword(email)
        }).send(res)
    }
    checkOtp = async (req, res, next) => {
        const otp = req.body.otp
        new OkResponse({
            message: "Otp code is correct",
            metadata: await AuthService.checkOtp(otp)
        }).send(res)
    }
    changePassword = async (req, res, next) => {
        const { resetToken, newPassword, confirmedPassword } = req.body
        new OkResponse({
            message: "Change Password successfull",
            metadata: await AuthService.changePassword({ resetToken, newPassword, confirmedPassword })
        }).send(res)
    }
}

module.exports = new AuthController()