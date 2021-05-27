const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption") //level 2 encrytion

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

  const secret = "ThisisOurLittleSecret" //This is the encryption key.Easy to hack as of now
  userSchema.plugin(encrypt, {secret: secret ,encryptedFields: ["password"]})  //lvl 2 encryption plugin

  const User = mongoose.model('User', userSchema);

app.get("/" , (req , res)=>{
    res.render("home");
})
app.get("/register" , (req , res)=>{
    res.render("register");
})
app.post("/register" , (req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })

    newUser.save(function(err) {
        if(err){
            console.log(err);
        }else{
            res.render("secret");
        }
    })
})
app.get("/login" , (req , res)=>{
    res.render("login");
})
app.post("/login",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username} , function(err , foundUser){
        if(err){
            console.log(err);
        }else{
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secret");
                }
            }
        }
    })
})

app.listen(3000 , ()=>{
    console.log('Port running on localhost: 3000');
})