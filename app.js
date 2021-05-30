require('dotenv').config(); //at the top
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require("bcrypt"); //requiring bcrypt hashing algorithm package
const saltRounds = 10; //number of rounds of salting

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(express.static("static"));
  mongoose.connect('mongodb://localhost:27017/authenticationDB', {useNewUrlParser: true, useUnifiedTopology: true});

  const userSchema = new mongoose.Schema({
      email: String,
      password: String
  })

  const User = mongoose.model('User', userSchema);

app.get("/" , (req , res)=>{
    res.render("home");
})
app.get("/register" , (req , res)=>{
    res.render("register");
})
app.post("/register" , (req,res)=>{
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) { //registering 
        const newUser = new User({
            email: req.body.username,
            password: hash
        })
    
        newUser.save(function(err) {
            if(err){
                console.log(err);
            }else{
                res.render("secret");
            }
        })
    });
    
})
app.get("/login" , (req , res)=>{
    res.render("login");
})
app.post("/login",(req,res)=>{                   //login.find the code in the bcryt package
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username} , function(err , foundUser){
        if(err){
            console.log(err);
        }else{
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result === true){
                        res.render("secret");
                    }
                });
            }
        }
    })
})

app.listen(3000 , ()=>{
    console.log('Port running on localhost: 3000');
})