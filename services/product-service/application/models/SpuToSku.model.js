const { DataTypes, Model } = require('sequelize');
class SpuToSku extends Model { }
const initializeSpuToSku = async (sequelize) => {
    SpuToSku.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sku_no: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        spu_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ProductId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        sequelize,
        modelName: "SpuToSku",
        tableName: "SpuToSku",
        timestamps: false,
        freezeTableName: true,
        indexes: [
            {
                fields: ['spu_no', 'sku_no'],
            },
        ],
    })
    return SpuToSku
}

module.exports = initializeSpuToSku