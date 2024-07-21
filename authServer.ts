import { generateAccessToken, generateRefreshToken } from "./tokenGeneration";
import { getUserFromToken } from "./validateToken";

require("dotenv").config();
//this will allow us to pull params from .env file
const express = require("express");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

const port = process.env.TOKEN_SERVER_PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const users: any = [];
let refreshTokens: any = [];


// REGISTER A USER
app.post("/createUser", async (req, res) => {
  const user = req.body.name;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  users.push({ user: user, password: hashedPassword });
  res.status(201).send(users);
});

//AUTHENTICATE LOGIN AND RETURN JWT TOKEN
app.post("/login", async (req, res) => {
  const user = users.find((c) => c.user == req.body.name);
  //check to see if the user exists in the list of registered users
  if (user == null) res.status(404).send("User does not exist!");
  //if user does not exist, send a 400 response
  if (await bcrypt.compare(req.body.password, user.password)) {
    const accessToken = generateAccessToken({ user: req.body.name });
    const refreshToken = generateRefreshToken({ user: req.body.name });
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } else {
    res.status(401).send("Password Incorrect!");
  }
});

//REFRESH TOKEN API
app.post("/refreshToken", (req, res) => {
  if (!refreshTokens.includes(req.body.token))
    res.status(400).send("Refresh Token Invalid");
  const username = getUserFromToken(req.body.token);
  if(username === req.body.name){
    //remove the old refreshToken from the refreshTokens list
    refreshTokens = refreshTokens.filter((c) => c != req.body.token);
    const accessToken = generateAccessToken({ user: username });
    const refreshToken = generateRefreshToken({ user: username });
    refreshTokens.push(refreshToken);
    //generate new accessToken and refreshTokens
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
  } else{
    res.status(400).json({ error: "Provided user does not match refresh token's user" })
  }
});

app.post("/logout", (req, res)=>{
  //remove the old refreshToken from the refreshTokens list
  refreshTokens = refreshTokens.filter( (c) => c != req.body.token)

  res.status(204).send("Logged out!")
})