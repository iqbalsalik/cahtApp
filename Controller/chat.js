const path = require("path")

exports.getChatPage = (req,res)=>{
    res.sendFile(path.join(__dirname,"..","Views","chat.html"))
}