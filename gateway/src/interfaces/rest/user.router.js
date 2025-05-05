const express = require('express');
const router = express.Router();
const userGrpcClient = require('../grpc/user/userClient');
const authenticateToken = require('..//../shared/middleware/auth')
router.post('/signup', (req, res) => {
    userGrpcClient.Signup(req.body, (err, response) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

router.post('/login', (req, res) => {
    userGrpcClient.Login(req.body, (err, response) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

router.post('/refresh-token', authenticateToken,(req, res) => {
    userGrpcClient.RefreshToken({ refresh_token: req.refreshToken }, (err, response) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(response);
    });
});

module.exports = router;