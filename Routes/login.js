const express = require("express");

const path = require("path");

const router = express.Router();

const loginController = require("../Controller/login")

router.get("/login",loginController.getLoginPage)

router.post("/login",loginController.userLogin)

module.exports = router;