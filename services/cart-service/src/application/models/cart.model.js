const { DataTypes, Model } = require('sequelize');

class Cart extends Model { }
const initializeCart = async (sequelize) => {
    Cart.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserId: {
            type: DataTypes.INTEGER,
        },
        cart_total: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        cart_status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: "Carts",
        tableName: "Carts",
        freezeTableName: true,
        timestamps: true
    })
    return Cart
}

module.exports = initializeCart;