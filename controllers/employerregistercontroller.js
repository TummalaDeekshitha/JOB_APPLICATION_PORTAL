// const bcrypt = require('bcrypt');
const express=require("express");
// const path=require("path");
const app=express();
require('dotenv').config();
const otpGenerator = require('otp-generator')
const nodemailer=require("nodemailer")
const mongoose=require("mongoose");
app.use(express.urlencoded({ extended: false ,limit: '50mb'}));
// app.use(express.static(path.join(__dirname,"public")));
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }));
//const {makeconnectionuser,Signupcoll,Corejob,Employerdetail,Applicationcollection,jobschema}=require("../mangoosefile");
// const { stringify } = require('querystring');
const multer=require("multer");
const upload=multer({dest:"uploads/"});
const {uploadfile}=require("../s3")
var router = express.Router();
var Employerdetail=require("../model/employerschemacoll");


const registeremployer=async(req,res)=>{
    try{
      

      const count=await Employerdetail.countDocuments({email:req.body.email});
      if(count>0)
      {
        const count2=await Employerdetail.countDocuments({email:req.body.email,eligible:false});
        if(count2>0)
        {
             res.render("../views/employerregister.ejs",{message:"your have already applied but application is not at approved"})
        }
        else{
            res.render("../views/employerlogin.ejs",{message:"your have account"});
        }

      }
      else{
    const subject=` so and so person wants to post in your portal   details ${req.body.email},${req.body.aadharnumber},${req.body.employeridnumber},${req.body.companyname},${req.body.industry}`
        const transporter=nodemailer.createTransport({
                    service: 'gmail',
              auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD,
              },
                })
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: process.env.ADMINEMAIL,
                    subject: "Jobforge",
                    text: `${subject} `,
                  };
             transporter.sendMail(mailOptions,async (error, info) => {
                    if (error) {
                      console.error('Error sending email:', error);
              
                      res.render("../views/emailerror.ejs")
                     
                    } else {
                      const file=req.file;
      console.log(file);
      const result1=await uploadfile(file);
      console.log(result1);
                      console.log('Email sent:', info.response);
                      let doc=new Employerdetail({
                        name:req.body.name,
                            companyname:req.body.companyname,
                            email:req.body.email,
                            pass:req.body.pass,
                            industry:req.body.industry,
                            employeridnumber:req.body.employeridnumber,
                            aadharnumber:req.body.aadharnumber,
                            photo:result1.Key,
                            admin:false,
                            eligible:false

                    })
                    await doc.save();
                     const token=await doc.generateAuthToken();
                     console.log(token);
                   res.render("../views/emailsendsuccess.ejs")
                 }
         });
     }

   
 }
 catch(error)
 {
     console.log(error);
 }
   
}

// const resendotp = async (req, res) => {
//   try {
//       const email = req.query.email;
//       const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
//       res.cookie("otp", otp, {
//           maxAge: 10000000,
//           httpOnly: true
//       });
//       const subject = 'JobForger';
//       const text = `Your OTP: ${otp}\n`;
//       await sendEmail(email, subject, text);
//       res.render("../views/otppage.ejs", { message: `${email}`, message2: "OTP got resend, check your mail" });
//   } catch (error) {
//       console.log(error);
//       // Handle error
//   }
// };

// const verifyotp=(req,res)=>{
//         const email=req.body.email;
//         console.log(req.body);
//         const otpValue = req.cookies.otp;
//         const enteredotp=req.body.otp;
//         console.log("this is"+email);
//         if(otpValue==enteredotp){
//         // let doc=new Employerdetail({
//         //     name:req.body.name,
//         //         companyname:req.body.companyname,
//         //         email:req.body.email,
//         //         pass:req.body.pass,
//         //         industry:req.body.industry,
//         //         employeridnumber:req.body.employeridnumber,
//         //         aadharnumber:req.body.aadharnumber,
    
//         // })
//         const insert=async()=>{
            
//             try{
        
//             const value=await Employerdetail.countDocuments({email:req.body.email});
//             if(value>0)
//             {
//              console.log("account already exist");
            
//               res.render("../views/employerlogin.ejs",{message:"you already have an account"});
    
//             }
    
//         else{
//             let doc=new Employerdetail({
//                     name:req.body.name,
//                         companyname:req.body.companyname,
//                         email:req.body.email,
//                         pass:req.body.pass,
//                         industry:req.body.industry,
//                         employeridnumber:req.body.employeridnumber,
//                         aadharnumber:req.body.aadharnumber,
            
//                 })
//                     const token=doc.generateAuthToken();
//                     console.log(token);
//                     res.cookie("employerjwt",token,{
//                         maxAge:100000,
//                         httpOnly:true
                        
//                     })
//           // await doc.save();
//            console.log("document saved")
//            res.render("../views/employerlogin.ejs",{message:"your account got created"});
//             }
//         }
//         catch(error){
//             console.log(error)
//         }
//     }
    
//         insert();
//     }
//         else{
//             res.render("../views/employerotppage.ejs",{email1:`${req.body.email}`,name1:`${req.body.name}`,companyname1:`${req.body.companyname}`,password1:`${req.body.pass}`,industry1:`${req.body.industry}`,employerid1:`${req.body.employeridnumber}`,aadharno1:`${req.body.aadharnumber}`,message2:"wrong otp"})
//         }
//     }
module.exports={registeremployer}