const path = require("path");
const express = require("express");
const http = require("http");

const app = express();

const server = http.createServer(app);
const sequelize = require("../Utils/database");

const io = require('socket.io')(server)

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
        await group.addUser(req.user,{transaction:t})
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
    const groupId = req.query.groupId;
    const user = await GroupJunction.findOne({
        where:{
            userId: id,
            groupId: groupId
        }
    });

    if(user){
        await user.destroy()
    };
    const admin = await Admin.findOne({where:{
        adminId: id,
        groupId: groupId
    }})
    if(admin){
        await admin.destroy()
    }
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
    let t;
try{
    t =await sequelize.transaction()
    const id = req.params.id;
    const userId = req.user.id;
    const group = await GroupJunction.findOne({
        where:{
            groupId: id,
            userId: userId
        }
    },{transaction:t})
    if(group){
        await group.destroy({transaction:t})
    }else{
        return res.status(404).json("Group Not Found!!")
    }
    const admin = await Admin.findOne({
        where:{
            adminId: userId,
            groupId: id
        }
    },{transaction:t})
    if(admin){
        await admin.destroy({transaction:t})
    }
    t.commit()
    res.status(200).json("Successfully left the group")
}catch(err){
    console.log(err)
    await t.rollback()
    res.status(400).json("Something Went Wrong!")
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