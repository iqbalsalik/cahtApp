const path = require("path");
const sequelize = require("../Utils/database");

const Group = require("../Models/group");
const User = require("../Models/userDetails");


exports.getCreateGropuPage = (req,res)=>{
    res.sendFile(path.join(__dirname,"..","Views","createGroup.html"));
}

exports.postGroup = async(req,res)=>{
    try{
        const t =await sequelize.transaction();
        const {memberList,grupName} = req.body
        console.log(req.user.id)

       const group =  await req.user.createGroup({
            adminId: req.user.id,
            groupName:grupName
        },{
            transaction: t
        });
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
            groupId: group.id
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
        res.status(200).json(groups);

    }catch(err){
        console.log(err)
    }
}

exports.getAllMembers = async(req,res)=>{
    try{
        const id = req.params.id;
        const group = await Group.findByPk(id);
        const users = await group.getUsers()
        res.status(200).json(users)
    }catch(err){
        console.log(err);
    }
}