const io = require("socket.io")(5000, {
    cors: {
        origin: ["http://127.0.0.1:5501","http://localhost:3000"],
    },
});

const jwt = require("jsonwebtoken")

const User = require("../Models/userDetails");
const message = require("../Models/message");
const Group = require("../Models/group");
const UserGroup = require("../Models/userGroup");
const Admin = require("../Models/admin")

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
    
            socket.on("joinRoom", group=>{
                const previousGroup = user.group;
                if (previousGroup) {
                    socket.leave(previousGroup);
                    socket.to(previousGroup).emit("leftChat",user.name)
                }
                user.group = group;
                socket.join(group);
                socket.to(group).emit("chatJoined",user.name)
            })
        }else{
            socket.emit("error","Not Authorized");
            socket.disconnect(true)
        }
    })
}

module.exports = socketApp