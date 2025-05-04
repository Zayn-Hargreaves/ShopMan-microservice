const {DataTypes, Model} = require('sequelize');
class Wishlists extends Model {}
const initializeWishLists = async(sequelize)=>{

    Wishlists.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        UserId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ProductId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },{
        sequelize,
        tableName:"WishLists",
        modelName:"WishLists",
        freezeTableName:true,
        timestamps:true
    })
    return Wishlists
}
module.exports = initializeWishLists;