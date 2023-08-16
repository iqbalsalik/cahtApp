const express = require("express");

const router = express.Router();

const userAuthentication = require("../authentication/auth");
const groupController = require("../Controller/group");

router.get("/creategroup",groupController.getCreateGropuPage);

router.post("/creategroup",userAuthentication.userAuthentication,groupController.postGroup);

router.delete("/deletegroup/:id",userAuthentication.userAuthentication,groupController.deleteGroup);

router.delete("/removemember/:id",userAuthentication.userAuthentication,groupController.removeMember);

router.post("/addMember/:id",userAuthentication.userAuthentication,groupController.addMember);

router.delete("/leaveGroup/:id",userAuthentication.userAuthentication,groupController.leaveGroup);

router.post("/makeadmin",userAuthentication.userAuthentication,groupController.makeAdmin);

module.exports = router;