const path = require("path")

const Sequelize = require("sequelize");

const Message = require("../Models/message");
const UserDetail = require("../Models/userDetails");

exports.getChatPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "chat.html"))
}

exports.getAllMessages = async (req, res) => {
    try {
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
        if(messages){
            for (let i = 0; i < messages.length; i++) {
                const user = await UserDetail.findByPk(messages[i].userId);
                if (user) {
                    let userName = user.name;
                    const userData = {
                        id: messages[i].id,
                        message: messages[i].message,
                        fileUrl: messages[i].fileUrl,
                        name: userName
                    }
                    messageArray.push(userData)
                }
            }
            return res.status(200).json(messageArray)
        }
       
    } catch (err) {
        console.log(err)
    }
}