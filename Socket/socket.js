const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
require("dotenv").config()

const User = require("../Models/userDetails");
const message = require("../Models/message");
const Group = require("../Models/group");
const UserGroup = require("../Models/userGroup");
const Admin = require("../Models/admin");

const io = require("socket.io")(5000, {
    cors: {
        origin: ["http://127.0.0.1:5501","http://localhost:3000"],
    },
});

function socketApp (){
    return io.on("connection", socket => {
    
    
        const authToken = socket.handshake.headers.authorization;
    
        const user = jwt.verify(authToken,process.env.JWT_TOCKEN);
        if(user){
            socket.on("getGroups", async () => {
                let allGroups = [];
                const groups = await Group.findAll({
                    include: [
                      {
                        model: User,
                        where: { id: user.userId }, 
                        through: {
                          model: UserGroup, 
                          attributes: []
                        }
                      }
                    ]
                  });
                for(let i=0;i<groups.length;i++){
                   let admin = await Admin.findOne({
                        where:{
                            adminId: user.userId,
                            groupId: groups[i].id
                        }
                    })
                    if(admin){
                        allGroups.push({
                            group: groups[i],
                            admin: true
                        })
                    }else{
                        allGroups.push({
                            group: groups[i],
                            admin: false
                        })
                    }
                }
    
                socket.emit("allGroups", allGroups);
            })
        
            let postedMessage
            socket.on("messageSent", async (message,group) => {
                const currentGroup =await Group.findByPk(group)
                if(currentGroup){
                    const tobePosted = {
                        message: message,
                        userId: user.userId,
                        name:user.name
                    }
                    const nameOfGroup = currentGroup.groupName
                    postedMessage = await currentGroup.createMessage(tobePosted)
                    socket.to(nameOfGroup).emit("messageRecieved", tobePosted)
                }
            })
    
            socket.on("joinRoom", (group,groupId)=>{
                const previousGroup = user.group;
                if (previousGroup) {
                    socket.leave(previousGroup);
                    user.groupId = ''
                    socket.to(previousGroup).emit("leftChat",user.name)
                }
                user.group = group;
                user.groupId = groupId
                socket.join(group);
                socket.to(group).emit("chatJoined",user.name)
            })

            socket.on("uploadFile", async ({ fileName, fileData }) => {
                const data = Buffer.from(fileData);
                const name = `${user.name}/${fileName}`
               const fileUrl = await uploadToAws(data,name)
                await message.create({
                    fileUrl: fileUrl,
                    userId: user.userId,
                    groupId: user.groupId
                })
               socket.to(user.group).emit("fileUploaded",{fileUrl,name:user.name})
            });
        }else{
            socket.emit("error","Not Authorized");
            socket.disconnect(true)
        }
    })
}

async function uploadToAws (data,name){
    try{
        const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
        const IAM_USER_KEY = process.env.AWS_USER_KEY;
        const IAM_USER_SECRET = process.env.AWS_USER_SECRET;
    
        let s2Bucket = new AWS.S3({
            accessKeyId:IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRET,
            Bucket:BUCKET_NAME
        })
    
        var params = {
            Bucket:BUCKET_NAME,
            Key:name,
            Body:data,
            ACL:"public-read"
        }
    
        return new Promise((resolve,reject)=>{
            s2Bucket.upload(params,(err,response)=>{
                if(err){
                    reject(err)
                }else{
                    resolve (response.Location)
                }
            })
        })
    }catch(err){
        return err
    }
    }

module.exports = socketApp