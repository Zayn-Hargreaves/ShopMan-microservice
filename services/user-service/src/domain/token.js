const jwt = require('jsonwebtoken');

function createAccessToken(payload){
    return jwt.sign(payload, process.env.ACCESS_SECRET, {expiresIn:'1h'})
}
function createResetToken(payload){
    return jwt.sign(payload, process.env.ACCESS_SECRET, {expiresIn:'15m'})
}
function generateTokenPair(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}

function verifyJWT(token, secret) {
    return jwt.verify(token, secret);
}

module.exports = { generateTokenPair, verifyJWT,createAccessToken,createResetToken};