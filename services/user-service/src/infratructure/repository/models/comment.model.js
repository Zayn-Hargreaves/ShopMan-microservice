const { DataTypes, Model } = require('sequelize');
class Comment extends Model { }
const initializeComments = async (sequelize) => {
    Comment.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserId: {
            type: DataTypes.INTEGER,

        },
        ProductId: {
            type: DataTypes.INTEGER,

        },
        rating: {
            type: DataTypes.INTEGER,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        left: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        right: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: "Comments",
        tableName: "Comments",
        freezeTableName: true,
        timestamps: true
    })
    return Comment
}

module.exports = initializeComments;