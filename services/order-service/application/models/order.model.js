
const { DataTypes, Model } = require('sequelize');


class Order extends Model { }
const initializeOrder = async (sequelize) => {
    Order.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserId: {
            type: DataTypes.INTEGER,

        },
        TotalPrice: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        Status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: "Orders",
        modelName: "Orders",
        freezeTableName: true,
        timestamps: true
    })
    return Order
}

module.exports = initializeOrder;