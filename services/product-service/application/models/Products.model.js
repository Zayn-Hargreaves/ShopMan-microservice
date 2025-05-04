const { DataTypes, Model } = require('sequelize');

class Product extends Model { }

const initializeProducts = async (sequelize) => {
    Product.init({
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
            type: DataTypes.STRING,
        },
        desc_plain: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        discount_percentage: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        thumb: {
            type: DataTypes.STRING,
        },
        attrs: {
            type: DataTypes.JSONB,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "active"
        },
        slug: {
            type: DataTypes.STRING,
            unique: true
        },
        CategoryId: {
            type: DataTypes.INTEGER,

            allowNull: false
        },
        CategoryPath: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true
        },
        sort: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10
        },
        ShopId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 4.5,
            validate: {
                min: 1,
                max: 5
            }
        },
        sale_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        has_variations: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

    }, {
        sequelize,
        modelName: "Products",
        tableName: "Products",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    })
    Product.addHook("beforeCreate", (product) => {
        product.slug = product.name.toLowerCase().replace(/ /g, "-");
    })
    return Product
}

module.exports = initializeProducts;