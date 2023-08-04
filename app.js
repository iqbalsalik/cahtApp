const express = require("express");
const bodyParser = require("body-parser");
const sequelize = require("./Utils/database")

const app = express();

app.use(express.static("Public"));
app.use(bodyParser.json())

const signUpRoutes = require("./Routes/signUp");

app.use(signUpRoutes);

sequelize.sync().then(()=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err)
})