const express = require("express");

const router = express.Router();

const userAuthentication = require("../authentication/auth");
const groupController = require("../Controller/group");

router.get("/creategroup",groupController.getCreateGropuPage);

router.post("/creategroup",userAuthentication.userAuthentication,groupController.postGroup);

router.get("/getallgroups",userAuthentication.userAuthentication,groupController.getAllGroups);

module.exports = router;