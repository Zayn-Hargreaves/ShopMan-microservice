
const { DataTypes, Model } = require('sequelize');

class Follows extends Model { }
const initializeFollows = async (sequelize) => {

    Follows.init({
        UserId: {
            type: DataTypes.INTEGER,
        },
        ShopId: {
            type: DataTypes.INTEGER,

        },
    }, {
        sequelize,
        modelName: "Follows",
        tableName: "Follows",
        freezeTableName: true,
        timestamps: true
    })
    return Follows
}

module.exports = initializeFollows;