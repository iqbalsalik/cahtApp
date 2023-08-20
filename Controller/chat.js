const path = require("path");
const { Op } = require('sequelize')

const Sequelize = require("sequelize");
const CronJob = require('cron').CronJob;

const Message = require("../Models/message");
const UserDetail = require("../Models/userDetails");
const ArchievedChat = require("../Models/ArchivedChat");

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
        if (messages) {
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

const today = new Date();
today.setUTCHours(0, 0, 0, 0);

var job = new CronJob(
    '0 0 * * *',
    async function () {
        const olderMessages = await Message.findAll({
            where: {
                createdAt: {
                    [Op.lt]: today
                }
            }
        });
    
        for (let i = 0; i < olderMessages.length; i++) {
            await ArchievedChat.create({
                message: olderMessages[i].message,
                fileUrl: olderMessages[i].fileUrl,
                userId: olderMessages[i].userId,
                groupId: olderMessages[i].groupId,
                createdAt: olderMessages[i].createdAt
            })
        }
        await Message.destroy({ where: {
            createdAt: {
                [Op.lt]: today
            }
        }})
    },
    null,
    true,
    'America/Los_Angeles'
);
// job.start()

