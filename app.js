const express = require("express");
require("dotenv").config();
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const sequelize = require("./Utils/database");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

const app = express();

const fs = require("fs");
const path = require("path")

const accessLogStream = fs.createWriteStream(path.join(__dirname,"access.log"),{flags:"a"})

app.use(cors({
    origin:"*",
    methods:["GET"]
}))
app.use(express.static("Public"));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan("combined",{ stream: accessLogStream}))

const User = require("./Models/userDetails");
const message = require("./Models/message");
const Group = require("./Models/group");
const UserGroup = require("./Models/userGroup");
const Admin = require("./Models/admin")

const socketApp = require("./Socket/socket");

const signUpRoutes = require("./Routes/signUp");
const loginRoutes = require("./Routes/login");
const chatRotuer = require("./Routes/chat");
const groupRouter = require("./Routes/group");


app.use(signUpRoutes);
app.use(loginRoutes);
app.use(chatRotuer);
app.use(groupRouter);

User.hasMany(message);
message.belongsTo(User);

User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

Group.hasMany(message);
message.belongsTo(Group);

socketApp()

sequelize.sync().then(()=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})

