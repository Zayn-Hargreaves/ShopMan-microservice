
const { DataTypes, Model } = require('sequelize');

class Notifications extends Model { }
const initializeNotifications = async (sequelize) => {
    Notifications.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        option: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ShopId: {
            type: DataTypes.INTEGER,

        },
        UserId: {
            type: DataTypes.INTEGER,

        },
    }, {
        sequelize,
        tableName: "Notifications",
        modelName: "Notifications",
        freezeTableName: true,
        timestamps: true
    })
    return Notifications
}

module.exports = initializeNotifications;