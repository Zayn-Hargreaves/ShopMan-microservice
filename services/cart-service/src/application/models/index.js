const databasePromise = require("../../infratructure/database")
const initializeCart = require("./cart.model")
const initializeCartDetails = require('./cartdetails.model')

const initializeModels = async()=>{
    try {
        const database = await databasePromise()
        const sequelize = await database.getSequelize()
        const Cart = await initializeCart(sequelize)
        const CartDetails = await initializeCartDetails(sequelize)
        await sequelize.sync()
        return {
            Cart, CartDetails
        }
    } catch (error) {
        console.log("Error initializing models:", error)
        throw new Error(error)   
    }
    
}

module.exports = initializeModels;