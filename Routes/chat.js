const express = require("express");

const chatController = require("../Controller/chat");
const auth = require("../authentication/auth");

const router = express.Router();

router.get("/chat",chatController.getChatPage);

router.post("/messagesent",auth.userAuthentication,chatController.postMessage);

router.get("/getmessages",auth.userAuthentication,chatController.getAllMessages)

module.exports = router;