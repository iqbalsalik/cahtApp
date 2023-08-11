const path = require("path");
const sequelize = require("../Utils/database");

const Group = require("../Models/group");
const User = require("../Models/userDetails");
const GroupJunction = require("../Models/userGroup");
const Admin = require("../Models/admin");


exports.getCreateGropuPage = (req,res)=>{
    res.sendFile(path.join(__dirname,"..","Views","createGroup.html"));
}

exports.postGroup = async(req,res)=>{
    let t;
    try{
         t =await sequelize.transaction();
        const {memberList,grupName} = req.body;
        const toCreateGroup = await Group.findOne({
            where:{
                groupName: grupName
            }
        },{
            transaction:t
        })
        if(toCreateGroup){
            return res.status(400).json("Group Name Already Exists! Try Another Name")
        }
       const group =  await req.user.createGroup({
            adminId: req.user.id,
            groupName:grupName
        },{
            transaction: t
        });
        const admin = await Admin.create({
            adminId: req.user.id,
            groupId: group.id
        })
        for(let i =0;i<memberList.length;i++){
            let user = await User.findOne({
                where:{
                    email: memberList[i]
                }
            },{transaction:t})
            if(user){
                await group.addUser(user,{transaction:t})
            }else{
                await group.addUser(req.user,{transaction:t})
                return
            }
        }
        t.commit();
        res.status(201).json({
            groupName:grupName,
            groupId: group.id,
            admin: admin
        })

    }catch(err){
        t.rollback()
        console.log(err);
    }
}

exports.getAllGroups = async (req,res)=>{
    try{
        const user = req.user
        const groups = await user.getGroups();
        let groupArray = [];
        for(let i=0;i<groups.length;i++){
            let isAdmin = await Admin.findOne({
                where:{
                    adminId: user.id,
                    groupId: groups[i].id
                }
            })
            if(isAdmin){
                groupArray.push({
                    group: groups[i],
                    isAdmin: true
                })
            }else{
                groupArray.push({
                    group: groups[i],
                    isAdmin: false
                })
            }
        }
        res.status(200).json({groupArray,userId:user.id});

    }catch(err){
        console.log(err)
    }
}

exports.getAllMembers = async(req,res)=>{
    try{
        const id = req.params.id;
        const group = await Group.findByPk(id);
        let admin;
        const IsAdmin = await Admin.findOne({
            where:{
                adminId: req.user.id,
                groupId: group.id
            }
        })
        if(IsAdmin){
            admin = true
        }else{
            admin = false
        }
        let userArray = []
        const users = await group.getUsers()
        for(let i =0;i<users.length;i++){
            let isAdmin = await Admin.findOne({
                where:{
                    adminId: users[i].id,
                    groupId: id
                }
            })
            if(isAdmin){
                let userDetails = {
                    user: users[i],
                    isAdmin: true
                }
                userArray.push(userDetails)
            }else{
                let userDetails = {
                    user: users[i],
                    isAdmin: false
                }
                userArray.push(userDetails)
            }
        }
        // res.status(200).json({users,admin})
        res.status(200).json({userArray,admin})
    }catch(err){
        console.log(err);
    }
}

exports.deleteGroup = async(req,res)=>{
    try{
        const id = req.params.id;
        const group = await Group.findByPk(id);
        if(group){
            await group.destroy()
        }
        res.status(200).json("Successfully Deleted")
    }catch(err){
        console.log(err)
    }
}

exports.removeMember = async (req,res)=>{
try{
    const id = req.params.id;
    console.log(id)
    const user = await GroupJunction.findOne({
        where:{
            userId: id
        }
    });

    if(user){
        await user.destroy()
    };
    res.status(200).json("Successfully Removed")

}catch(err){
    console.log(err)
}
}

exports.addMember = async(req,res)=>{
    try{
        const t =await sequelize.transaction();
        const id = req.params.id;
        const group = await Group.findOne({
            where:{
                id:id
            }
        },{transaction:t})
        let user;
        if(group){
             user = await User.findOne({
                where:{
                    email:req.body.memberEmail
                }
            });
            if(user){
                await group.addUser(user,{transaction:t})
            }else{
                return res.status(404).json("User Not Found!")
            }
        }else{
            return res.status(404).json("Group Not Found!")
        }
        t.commit()
        res.status(201).json({
            message:"Successfully Added",
            id:user.id,
            name:user.name
    })
    }catch(err){
        t.rollback()
        console.log(err)
    }
}

exports.leaveGroup = async (req,res)=>{
try{
    const id = req.params.id;
    const userId = req.user.id;
    const group = await GroupJunction.findOne({
        where:{
            groupId: id,
            userId: userId
        }
    })
    if(group){
        await group.destroy()
    }else{
        return res.status(404).json("Group Not Found!!")
    }
    res.status(200).json("Successfully left the group")
}catch(err){
    console.log(err)
    alert(err.response.data)
}
}

exports.makeAdmin = async (req,res)=>{
    try{
        const{ adminId, groupId } = req.body;
        const adminUser = await Admin.findOne({
            where:{
                adminId: req.user.id,
                groupId: groupId
            }
        })
        console.log(adminUser)
        if(adminUser){
            await Admin.create({
                adminId: adminId,
                groupId: groupId
            })
        }else{
            return res.status(400).json("You are not Authorized for this operation!!")
        }
       res.status(201).json("Successfully Added!!")
    }catch(err){
        console.log(err)
    }
}