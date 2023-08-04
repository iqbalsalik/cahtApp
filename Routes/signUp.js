const express = require("express");

const path = require("path")

const router = express.Router();

const signUpController = require("../Controller/signUp")

router.get("/signUp",signUpController.getSignUpPage);
router.post("/signUp",signUpController.postUser);

module.exports = router;