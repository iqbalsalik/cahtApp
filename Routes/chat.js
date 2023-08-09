const express = require("express");

const chatController = require("../Controller/chat");
const auth = require("../authentication/auth");
const groupController = require("../Controller/group");

const router = express.Router();

router.get("/chat",chatController.getChatPage);

router.post("/messagesent",auth.userAuthentication,chatController.postMessage);

router.get("/getmessages/:groupId",auth.userAuthentication,chatController.getAllMessages);

router.get("/memberchat/:id",auth.userAuthentication,groupController.getAllMembers)

module.exports = router;