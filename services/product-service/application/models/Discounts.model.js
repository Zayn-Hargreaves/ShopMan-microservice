
const {DataTypes, Model} = require('sequelize');
const RedisService = require("../services/Redis.Service");

class Discounts extends Model {}
const initializeDiscounts = async(sequelize)=>{
    Discounts.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false
        },
        desc:{
            type: DataTypes.STRING,
        },
        value:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        type:{
            type: DataTypes.STRING,
            allowNull: false
        },
        code:{
            type: DataTypes.STRING,
            allowNull: false
        },
        StartDate:{
            type: DataTypes.DATE,
            allowNull: false
        },
        EndDate:{
            type: DataTypes.DATE,
            allowNull: false
        },
        MaxUses:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        UserCounts:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        MinValueOrders:{
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        status:{
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue:"active"
        },
        ShopId:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        CampaignId:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },{
        sequelize,
        modelName:"Discounts",
        tableName:"Discounts",
        freezeTableName:true,
        timestamps:true,
    })
    return Discounts
}

module.exports = initializeDiscounts;