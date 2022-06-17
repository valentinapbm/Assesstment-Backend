const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const req = require("express/lib/request");
require("dotenv").config();
const {connect} =require("./src/db")

const port = process.env.PORT;
const app = express();
connect();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.listen(port, () => {
    console.log(`Port: ${port} listening`);
    });
