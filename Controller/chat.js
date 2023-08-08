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
        const messageArray = []
        const messages = await Message.findAll({
            where: {
              id: {
                [Sequelize.Op.gt]: id,
              },
            },
          });
        for(let i =0; i<messages.length; i++){
           let userName;
           if(messages[i].userId == req.user.id){
            userName = "You"
           }else{
            const user = await UserDetail.findByPk(messages[i].userId);
            userName = user.name
           }
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
       const postedMessage =  await req.user.createMessage({message:req.body.message});
    //    const name = req.user.name;
       res.status(201).json({postedMessage,name:"you"});
    }catch(err){
        console.log(err)
    }
}