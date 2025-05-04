const {DataTypes, Model} = require('sequelize');
class SkuSpecs extends Model{}
const initializeSkuSpecs = async(sequelize)=>{
    SkuSpecs.init({
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        sku_specs:{
            type:DataTypes.JSONB,
            allowNull:true,
        },
        SkuId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    },{
        sequelize,
        modelName:"SkuSpecs",
        tableName:"SkuSpecs",
        freezeTableName:true,
        timestamps:false,
    })
    return SkuSpecs
}

module.exports = initializeSkuSpecs