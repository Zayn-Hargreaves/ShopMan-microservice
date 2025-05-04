const databasePromise = require("../../infratructure/database")
const initializeCategory = require("./Category.model")
const initializeComments = require("./Comment.model")
const initializeDiscount = require("./Discounts.model")
const initializationDiscountsProducts = require("./DiscountsProducts.model")
const initializeInventory = require("./Inventories.model")
const initializeProduct = require("./Products.model")
const initializeSku= require("./Sku.model")
const initializeSkuAtrr = require("./SkuAttr.model")
const initializeSkuSpecs = require("./SkuSpecs.model")
const initializeSpuToSku = require("./SpuToSku.model")
const initializeWishList = require("./WishLists.model")

const initializeModels = async()=>{
    try {
        const database = await databasePromise()
        const sequelize = database.getSequelize()
        const Category = await initializeCategory(sequelize)
        const Comments = await initializeComments(sequelize)
        const Discounts = await initializeDiscount(sequelize)
        const DiscountsProducts = await initializationDiscountsProducts(sequelize)
        const Inventories = await initializeInventory(sequelize)
        const Product = await initializeProduct(sequelize)
        const Sku = await initializeSku(sequelize)
        const SkuAttr = await initializeSkuAtrr(sequelize)
        const SkuSpecs = await initializeSkuSpecs(sequelize)
        const SpuToSku = await initializeSpuToSku(sequelize)
        const WishLists = await initializeWishList(sequelize)
        await sequelize.sync()
        return {
            Category,Comments,Discounts,DiscountsProducts,Inventories,Product,Sku,SkuAttr,SkuSpecs, SpuToSku,WishLists
        }
    } catch (error) {
        console.log("Error initializing models:", error)
        throw new Error(error)
    }
}

module.exports = initializeModels;