require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
module.exports = {

    jwt: {
        accessSecret: process.env.ACCESS_SECRET || 'your_access_secret',
        refreshSecret: process.env.REFRESH_SECRET || 'your_refresh_secret',
        accessTokenExpiry: '1h',
        refreshTokenExpiry: '7d',
    },
    postgres: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        url:process.env.DB_URL
    },
    redis: {
        port:process.env.REDIS_PORT,
        host:process.env.REDIS_HOST,
        username:process.env.REDIS_USERNAME,
        password:process.env.REDIS_PASSWORD,
        db:process.env.REDIS_DB,
        url:process.env.REDIS_URL
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL,
    },
    edb:{
        url:process.env.EDB_URL
    }
};