const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./Utils/database");
const cors = require("cors");

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

app.use(signUpRoutes);
app.use(loginRoutes);
app.use(chatRotuer);

sequelize.sync().then(()=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})