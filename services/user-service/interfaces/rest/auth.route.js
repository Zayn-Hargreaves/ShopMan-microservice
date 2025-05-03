const express = require('express');
const router = express.Router();
const {asyncHandler} = require("../../helpers/asyncHandler");
const authController = require('../../application/auth.controller');


router.post('/signup', asyncHandler(authController.signup))

router.post('/login', asyncHandler(authController.login));
router.post('/login-with-google', asyncHandler(authController.loginWithGoogle))
router.post("/logout", asyncHandler(authController.logout))
router.post('/refresh-token', asyncHandler(authController.handleRefreshToken));
router.post("/forgot-password", asyncHandler(authController.forgotPassword))
router.post("/check-otp", asyncHandler(authController.checkOtp))
router.post("/change-password", asyncHandler(authController.changePassword))

module.exports = router;