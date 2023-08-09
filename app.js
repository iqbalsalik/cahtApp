const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./Utils/database");
const cors = require("cors");

const User = require("./Models/userDetails");
const message = require("./Models/message");
const Group = require("./Models/group");
const UserGroup = require("./Models/userGroup");

const app = express();

app.use(cors({
    origin:"*",
    methods:["GET"]
}))
app.use(express.static("Public"));
app.use(bodyParser.json())

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

sequelize.sync().then(()=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})