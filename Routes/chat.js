const express = require("express");

const chatController = require("../Controller/chat")

const router = express.Router();

router.get("/chat",chatController.getChatPage);

module.exports = router;