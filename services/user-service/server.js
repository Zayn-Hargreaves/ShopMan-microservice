require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./interfaces/rest/auth.route');
const userRoutes = require("./interfaces/rest/user.route")


app.use((err, req, res, next) => {
    console.log('🛑 JSON parse error?', err.message);
    next(err);
});
app.use((req, res, next) => {
    console.log('🔍 Request received:', req.method, req.originalUrl);
    next();
});



app.use(express.json());

app.use('/auth', authRoutes);
app.use("/", userRoutes )

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});