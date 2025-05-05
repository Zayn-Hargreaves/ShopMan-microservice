const databasePromise = require("../../infratructure/database")
const initializeOrder = require("./order.model")
const initializeOrderDetails = require("./orderDetail.model")


const initializeModels = async()=>{
    try {
        const database = await databasePromise()
        const sequelize = database.getSequelize()
     
        const Order = await initializeOrder(sequelize)
        const OrderDetails = await initializeOrderDetails(sequelize)
        
        await sequelize.sync()
        return {
            OrderDetails,Order
        }
    } catch (error) {
        console.log("Error initializing models:", error)
        throw new Error(error)
    }
}

module.exports = initializeModels;