const { DataTypes, Model } = require('sequelize');

class User extends Model { }
const initializeUser = async (sequelize) => {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
        },
        google_id: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        avatar: {
            type: DataTypes.STRING,
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "active"
        },
    }, {
        sequelize,
        modelName: "Users",
        tableName: "Users",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    })
    return User
}

module.exports = initializeUser;