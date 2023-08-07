const jwt = require("jsonwebtoken");
const User = require("../Models/userDetails");
require("dotenv").config()

const userAuthentication = async(req,res,next)=>{
    try{
        const token = req.header("authorization");
        const authUser = jwt.verify(token,process.env.JWT_TOCKEN);
        const user = await User.findByPk(authUser.userId);
        req.user= user;
        next()
    }catch(err){
        res.status(404).json("User Not Found!!")
    }
}

module.exports = {userAuthentication};