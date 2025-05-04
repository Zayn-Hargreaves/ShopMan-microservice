const { DataTypes, Model } = require('sequelize');
const slugify = require('slugify');

class Category extends Model { }
const initializeCategory = async (sequelize) => {
    Category.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        desc: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        thumb: {
            type: DataTypes.STRING
        },
        slug: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Categories',
        tableName: 'Categories',
        freezeTableName: true,
        paranoid: true,
        timestamps: true
    });

    Category.addHook('beforeSave', (category) => {
        if (category.name) {
            category.slug = slugify(category.name, {
                lower: true,
                strict: true,
                replacement: '-'
            });
        }
    });

    return Category;
};

module.exports = initializeCategory;