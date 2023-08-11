const path = require("path")

const sequelize = require("../Utils/database");
const Sequelize = require("sequelize");

const Message = require("../Models/message");
const UserDetail = require("../Models/userDetails");

exports.getChatPage = (req,res)=>{
    res.sendFile(path.join(__dirname,"..","Views","chat.html"))
}

exports.getAllMessages = async (req,res)=>{
    try{
        const id = req.query.id;
        const groupId = req.params.groupId;
        const messageArray = []
        const messages = await Message.findAll({
            where: {
              id: {
                [Sequelize.Op.gt]: id,
              },
              groupId: groupId
            },
          });
        for(let i =0; i<messages.length; i++){
            const user = await UserDetail.findByPk(messages[i].userId);
            let userName = user.name;
            const userData = {
                id: messages[i].id,
                message:messages[i].message,
                name: userName
            }
            messageArray.push(userData)
        }
        res.status(200).json(messageArray)
    }catch(err){
        console.log(err)
    }
}

exports.postMessage = async (req,res)=>{
    try{
        const {message,groupId} = req.body
       const postedMessage = await Message.create({
        message: message,
        userId: req.user.id,
        groupId: groupId
       })
       let currentSender= false
       if(req.user.id == postedMessage.userId){
        currentSender = true
       }

       res.status(201).json({postedMessage,name:req.user.name,currentSender});
    }catch(err){
        console.log(err)
    }
}