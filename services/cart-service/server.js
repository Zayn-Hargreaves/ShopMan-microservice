require('dotenv').config();
const express = require('express');
const app = express();
const CartRoutes = require("./interfaces/rest/cart.route.js")


app.use((err, req, res, next) => {
    console.log('🛑 JSON parse error?', err.message);
    next(err);
});
app.use((req, res, next) => {
    console.log('🔍 Request received:', req.method, req.originalUrl);
    next();
});




app.use(express.json());

app.use("/", CartRoutes )

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});