const databasePromise = require("../../infratructure/database")

const initializeInventory = require("./Inventories.model")
const initializeProduct = require("./Products.model")
const initializeSku= require("./Sku.model")
const initializeSkuAtrr = require("./SkuAttr.model")
const initializeSkuSpecs = require("./SkuSpecs.model")
const initializeSpuToSku = require("./SpuToSku.model")

const initializeModels = async()=>{
    try {
        const database = await databasePromise()
        const sequelize = database.getSequelize()
     
        const Inventories = await initializeInventory(sequelize)
        const Product = await initializeProduct(sequelize)
        const Sku = await initializeSku(sequelize)
        console.log(Sku)
        const SkuAttr = await initializeSkuAtrr(sequelize)
        const SkuSpecs = await initializeSkuSpecs(sequelize)
        const SpuToSku = await initializeSpuToSku(sequelize)
        await sequelize.sync()
        return {
            Inventories,Product,Sku,SkuAttr,SkuSpecs, SpuToSku
        }
    } catch (error) {
        console.log("Error initializing models:", error)
        throw new Error(error)
    }
}

module.exports = initializeModels;