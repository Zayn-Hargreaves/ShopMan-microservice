const express = require("express")
const router = express.Router()
const {asyncHandler} = require("../../helpers/asyncHandler")
const userController = require("../../application/user.controller")

router.get("/profile", asyncHandler(userController.getUserProfile))
router.post("/profile/update", asyncHandler(userController.updateUserProfile))
module.exports = router