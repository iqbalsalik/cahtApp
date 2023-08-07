const path = require("path")

const Message = require("../Models/message");
const UserDetail = require("../Models/userDetails");

exports.getChatPage = (req,res)=>{
    res.sendFile(path.join(__dirname,"..","Views","chat.html"))
}

exports.getAllMessages = async (req,res)=>{
    try{
        const messageArray = []
        const messages = await Message.findAll();
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
       res.status(201).json(postedMessage);
    }catch(err){
        console.log(err)
    }
}