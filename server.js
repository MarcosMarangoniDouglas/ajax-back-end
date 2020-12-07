require('dotenv').config({path: '.env'})

//create an instance of express object
const express = require("express");

//INstance of express app (server)
const app = express();

//getting around cross-origin (CORS) policy
const cors = require('cors');
app.use(cors());
//app.listen(3001, () => console.log("server has started at port 3001"));

//mongose instance
const mongoose = require("mongoose");

//define database connection string
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
//connect to the database 
const db = mongoose.connection;

//report any error if connection

db.on("error", error => console.log(error));

//Provide feedback about successful connection
db.once("open", () => console.log("connection to db established"));

//return JSON content
app.use(express.json());

//referencing routes file
const charactersRouter = require("./routes/characters");
app.use("/characters", charactersRouter);

//app.listen(3001, () => console.log("server has started at port 3001"));
app.listen(process.env.PORT, () => console.log('server has started at port', process.env.PORT));
