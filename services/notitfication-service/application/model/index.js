const databasePromise = require("../../infratructure/database")
const initializeNotification = require("./notification.model")

const initializeModels = async()=>{
    try {
        const database = await databasePromise()
        const sequelize = database.getSequelize()
     
        const Notification = await initializeNotification(sequelize)
        await sequelize.sync()
        return {
            Notification
        }
    } catch (error) {
        console.log("Error initializing models:", error)
        throw new Error(error)
    }
}

module.exports = initializeModels;