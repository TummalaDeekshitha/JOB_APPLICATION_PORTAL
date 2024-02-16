 const express=require("express");
// const bcrypt = require('bcrypt');
 var router = express.Router();
// const session = require("express-session");
// const multer=require("multer");
// const nodemailer=require("nodemailer")
// const jwt=require("jsonwebtoken")
// const otpGenerator = require('otp-generator')
// const cookieParser=require("cookie-parser")

var Employerdetail=require("../model/employerschemacoll");
const {adminprotect}=require("../middleware/adminprotect");
const {verify,adminabout,adminsendotp,adminloginverifyotp,adminloginconfirmpassword,removeemployer,rejectemployer,addemployer}=require("../controllers/admincontroller.js")
router.get("/",verify);
router.post("/adminabout",adminabout)
router.get("/adminforgotpassword",(req,res)=>{
    res.render("../views/adminforgotpassword.ejs");
})
router.post("/adminsendotp",adminsendotp)
router.post("/adminloginverifyotp",adminloginverifyotp)
router.post("/adminloginconfirmpassword",adminloginconfirmpassword)

router.get("/removeemployer",adminprotect,removeemployer)
router.get("/rejectemployer",adminprotect,rejectemployer)
router.get("/addemployer",adminprotect,addemployer)
router.get("/addadmin",adminprotect,async(req,res)=>{
res.render("../views/addadmin.ejs",{user:req.user})
})
router.post("/adminadded",adminprotect,async(req,res)=>{
email1=req.body.email;
password=req.body.password;
const count=await Employerdetail.countDocuments({email:email1});
const s=await Employerdetail.updateOne({email:email1},{$set :{name:req.body.username,email:req.body.eamil,pass:req.body.password,admin:true,eligible:true}},{ upsert: true } )
 console.log(s);
})

module.exports=router