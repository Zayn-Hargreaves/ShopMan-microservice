
const { DataTypes, Model } = require('sequelize');

class CartDetails extends Model { }
const initializeCartDetails = async (sequelize) => {
    CartDetails.init({
        CartId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        ProductId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sku_no: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: "CartsDetails",
        tableName: "CartsDetails",
        freezeTableName: true,
        timestamps: true
    })
    return CartDetails
}
module.exports = initializeCartDetails;