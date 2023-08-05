const path = require("path");

const User = require("../Models/userDetails");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()

function generateToken(id, name) {
    return jwt.sign({ userId: id, name: name }, process.env.JWT_TOCKEN);
}

exports.getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Views", "login.html"))
}

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(404).json("User Not Found!!");
        }
        bcrypt.compare(password, user.password, (err, isMatched) => {
            if (isMatched) {
                res.status(200).json({ message: "Successfully Loged In!!", token: generateToken(user.id, user.name) })
            } else {
                return res.status(401).json("User not Authorized!!")
            }
        })
    } catch (err) {
        res.status(500).json(err)
    }
}