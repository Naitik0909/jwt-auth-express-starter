import {validateTokenMiddleware} from "./validateToken";

require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const port = process.env.PORT;
//We will run this server on a different port i.e. port 5000
app.listen(port, () => {
  console.log(`Validation server running on ${port}...`);
});
app.get("/posts", validateTokenMiddleware, (req, res) => {
  console.log("Token is valid");
  console.log(req.user.user);
  res.send(`${req.user.user} successfully accessed post`);
});
