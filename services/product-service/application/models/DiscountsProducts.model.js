
const {DataTypes, Model} = require('sequelize');
class DiscountsProducts extends Model {}
const initializeDiscountsProducts = async(sequelize)=>{

    DiscountsProducts.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        DiscountId:{
            type:DataTypes.INTEGER,
        },
        ProductId:{
            type:DataTypes.INTEGER,
        }
    },{
        sequelize,
        modelName:"DiscountsProducts",
        tableName:"DiscountsProducts",
        freezeTableName:true,
        timestamps:true
    })
    return DiscountsProducts
}

module.exports = initializeDiscountsProducts;