const path = require("path");

const bcrypt = require("bcrypt");

const User = require('../Models/userDetails');

exports.getSignUpPage = (req,res)=>{
    res.sendFile(path.join(__dirname,"..","views","signUp.html"))
};

exports.postUser = async (req,res)=>{
    try{
        const {name,email,phone,password} = req.body;
        const user = await User.findOne({where:{
            email: email
        }})

        if(user){
            return res.status(409).json("User Already Exist!! Please login.")
        }

        bcrypt.hash(password,10,async (err,hashedPass)=>{
            if(err){
                return res.status(500).json("Something Went Wrong!!")
            }
            await User.create({
                name: name,
                email: email,
                phone: phone,
                password: hashedPass
            })
            res.status(201).json("Successfully signed Up")
        })
    }catch(err){
        res.status(500).json("Something Went Wrong!!")
    }
}