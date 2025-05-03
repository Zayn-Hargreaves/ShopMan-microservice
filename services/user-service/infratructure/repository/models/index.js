const databasePromise = require("../../../infratructure/database")
const initializeAddress = require("./address.model")
const initializeComments = require("./comment.model")
const initializeFollows = require("./follow.model")
const initializeOtp = require("./otp.model")
const initializeUser = require("./user.model")

const initializeModels = async () => {
    try {
        const database = await databasePromise()
        const sequelize = database.getSequelize()
        const Address = await initializeAddress(sequelize)
        const Comments = await initializeComments(sequelize)
        const Follows = await initializeFollows(sequelize)
        const Otp = await initializeOtp(sequelize)
        const User = await initializeUser(sequelize)
        await sequelize.sync()
        return {
            Address, Comments, Follows, Otp, User
        }
    } catch (error) {
        console.log("Error initializing models:", error)
        throw new Error(error)
    }
}

module.exports = initializeModels
