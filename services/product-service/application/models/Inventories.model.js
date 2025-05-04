
const {DataTypes, Model} = require('sequelize');


class Inventories extends Model {}
const initializeInventories = async(sequelize)=>{
    Inventories.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ProductId:{
            type: DataTypes.INTEGER,
           
            allowNull: false
        },
        ShopId:{
            type: DataTypes.INTEGER,
          
            allowNull: false
        },
        inven_quantity:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        inven_location:{
            type: DataTypes.STRING,
            allowNull: false
        },
    },{
        sequelize,
        tableName:"Inventories",
        modelName:"Inventories",
        freezeTableName:true,
        timestamps:true
    })
    return Inventories
}

module.exports = initializeInventories;