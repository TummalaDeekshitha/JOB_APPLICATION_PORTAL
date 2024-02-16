// const bcrypt = require('bcrypt');
 const express=require("express");
// const path=require("path");
// const app=express();

// const session = require("express-session");
// const otpGenerator = require('otp-generator')
// const nodemailer=require("nodemailer")
// const mongoose=require("mongoose");
// const { error } = require("console");
// const grid = require('gridfs-stream');
// app.use(express.urlencoded({ extended: false ,limit: '50mb'}));
// // app.use(express.static(path.join(__dirname,"public")));
// const jwt=require("jsonwebtoken")
// const cookieParser=require("cookie-parser")
// app.use(cookieParser())
// app.use(express.json({ limit: '50mb' }));
// //const {makeconnectionuser,Signupcoll,Corejob,Employerdetail,Applicationcollection,jobschema}=require("../mangoosefile");
// const { stringify } = require('querystring');
const multer=require("multer");
const upload=multer({dest:"uploads/"});
// const {uploadfile}=require("../s3")
 var router = express.Router();
// var Employerdetail=require("../model/employerschemacoll");
const {registeremployer, resendotp,verifyotp}=require("../controllers/employerregistercontroller.js")

router.get("/doemployerregistration",(req,res)=>{
    res.render("employerregister.ejs",{message:""});
})
// router.post("/registeremployer",async(req,res)=>{
//     //console.log(req.body);
//     try{
//     const otp1=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
//         res.cookie("otp",otp1,{
//             maxAge:10000000,
//             httpOnly:true
//         });
//         const transporter=nodemailer.createTransport({
//                     service: 'gmail',
//               auth: {
//                 user: '20311a1206@sreenidhi.edu.in',
//                 pass: '20311A1206',
//               },
//                 })
//                 const mailOptions = {
//                     from: '20311a1206@sreenidhi.edu.in',
//                     to: req.body.email,
//                     subject: 'JobForger',
//                     text: `your OTP : ${otp1}\n `,
//                   };
//              transporter.sendMail(mailOptions, (error, info) => {
//                     if (error) {
//                       console.error('Error sending email:', error);
//                     } else {
//                       console.log('Email sent:', info.response);
//                     }
//             });

//         res.render("../views/employerotppage.ejs",{email1:`${req.body.email}`,name1:`${req.body.name}`,companyname1:`${req.body.companyname}`,password1:`${req.body.pass}`,industry1:`${req.body.industry}`,employerid1:`${req.body.employeridnumber}`,aadharno1:`${req.body.aadharnumber}`,message2:"OTP got send"})
//     }
//     catch(error)
//     {
//         console.log(error);
//     }
      
// })
router.post("/registeremployer",upload.single("photo"), registeremployer)
router.get("/resendotp",resendotp)
router.post("/verifyotp",verifyotp)
module.exports=router