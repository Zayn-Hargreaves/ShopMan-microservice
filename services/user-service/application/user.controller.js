const { OkResponse } = require("../shared/cores/success.response")
const UserService = require("./user.service")

class UserController{
    getUserProfile = async(req, res, next)=>{
        const userId = req.userId
        new OkResponse({
            message:"get user profile success",
            metadata: await UserService.getUserProfile(userId)
        }).send(res)
    }
    updateUserProfile = async(req, res, next)=>{
        const {user, address} = req.body
        const userId = req.userId
        new OkResponse({
            message:"update user profile success",
            metadata:await UserService.updateUserProfile(userId,{user, address})
        }).send(res)
    }
}

module.exports = new UserController()