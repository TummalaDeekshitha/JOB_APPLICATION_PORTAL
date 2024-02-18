const express=require("express");
const bcrypt = require('bcrypt');
var router = express.Router();
const session = require("express-session");
const multer=require("multer");
const nodemailer=require("nodemailer")
const jwt=require("jsonwebtoken")
const otpGenerator = require('otp-generator')
const cookieParser=require("cookie-parser")
var Employerdetail=require("../model/employerschemacoll");
const {adminprotect}=require("../middleware/adminprotect");
var Applicationcollection=require("../model/appschemacoll");
const verify = async(req,res)=>{
    if(req.cookies.adminjwt)
    {  const decoded = jwt.verify(req.cookies.adminjwt, "thisismyfirstnodejsexpressmongodbproject");
    const resultdoc = await Employerdetail.find({ admin:false });
      res.render("../views/adminabout.ejs",{employerDetails:resultdoc,user:decoded.name});
    }
    else{
      res.render("../views/adminlogin.ejs",{message:"login here"});
    }
  }
  const adminabout=async(req,res)=>{
    const mail=req.body.email1;
    const pass=req.body.password1
    const count=await Employerdetail.countDocuments({email:mail,admin:true});
    if(count>0)
    {  
     const result =await Employerdetail.findOne({email:mail,admin:true})
        const result2 = await bcrypt.compare(pass, result.pass);
        const token= result.tokens[0].token;
        console.log(token)
        if(result2>0)
    {
        res.cookie("adminjwt",token,{
            maxAge:10000000,
            httpOnly:true
        });
        const resultdoc = await Employerdetail.find({ admin:false });
        
        console.log(resultdoc);
        res.render('../views/adminabout.ejs',{user:result.name,employerDetails:resultdoc});
    }
    else{
        res.render('../views/adminlogin.ejs',{message:"credentials error"})
    }
    }
    else{
        res.render("../views/adminlogin.ejs",{message:"you are not admin"})
    }

}
const adminsendotp=async(req,res)=>{
  console.log(req.body.email);
  const result =await Employerdetail.findOne({email:req.body.email,admin:true})
  const result1=await Employerdetail.countDocuments({email:req.body.email,admin:true})
  //const resultn=await db1.find({});
  try{
  if(result1)
  {  
  
  const otp1=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
      res.cookie("otp",otp1,{
          maxAge:1000000,
          httpOnly:true
      });
      const transporter=nodemailer.createTransport({
                  service: 'gmail',
            auth: {
              user: '20311a1206@sreenidhi.edu.in',
              pass: '20311A1206',
            },
              })
              const mailOptions = {
                  from: '20311a1206@sreenidhi.edu.in',
                  to: req.body.email,
                  subject: 'JobForger',
                  text: `your OTP : ${otp1}\n `,
                };
           transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    console.error('Error sending email:', error);
                  } else {
                    console.log('Email sent:', info.response);
                  }
          });

      res.render("../views/adminloginotppage.ejs",{message:`${req.body.email}`})
  }
else{
      res.render("../views/adminlogin.ejs",{message:"you are not admin"})
  }
}catch(error)
{
  console.log(error);
}

}
const adminloginverifyotp=(req,res)=>{
  const email=req.body.email;
  console.log(req.body);
  const otpValue = req.cookies.otp;
  const enteredotp=req.body.otp;
  console.log("this is"+email);
  if(otpValue==enteredotp){
  res.render("../views/adminloginchangepassword.ejs",{emailvalue:email,message:""});
  }
  else{
      res.render("../views/adminforgotpassword.ejs",{message:"wrong otp Access Denied"});
  }
}

const adminloginconfirmpassword=async (req,res)=>{
  if(req.body.confirmPassword==req.body.newPassword)
{
console.log(req.body.email);
console.log(req.body.newPassword);
const newpassword=req.body.newPassword
const hashedPassword = await bcrypt.hash(newpassword, 10);

  const result1=await Employerdetail.updateOne({email:req.body.email},{$set:{pass:hashedPassword}});
  console.log(result1);
  res.render("../views/adminlogin.ejs",{message:"your password changed "})
}
else{
res.render("../views/adminloginchangepassword.ejs",{message:"password not match"})
}}

const removeemployer=async(req,res)=>{
  try{
  const mail=req.query.email;
  console.log(mail);
  const c=await Employerdetail.updateOne({email:mail},{$set: {eligible:false}})
  console.log(c);
  const transporter=nodemailer.createTransport({
      service: 'gmail',
auth: {
  user: '20311a1206@sreenidhi.edu.in',
  pass: '20311A1206',
},
  })
  const mailOptions = {
      from: '20311a1206@sreenidhi.edu.in',
      to: mail,
      subject: 'JobForger',
      text: `your permissions to post the job in JobForge is removed`,
    };
transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
});

  const resultdoc = await Employerdetail.find({ admin: { $ne: true } });
      
  console.log(resultdoc);
  res.render('../views/adminabout.ejs',{user:req.myusername,employerDetails:resultdoc});
  }
  catch(error)
  {
      console.log(error);
  }

}
const rejectemployer=async(req,res)=>{
  try{
  const mail=req.query.email;
  const c=await Employerdetail.deleteOne({email:mail})
  console.log(c);
  const resultdoc = await Employerdetail.find({ admin: { $ne: true } });
  const transporter=nodemailer.createTransport({
      service: 'gmail',
auth: {
  user: '20311a1206@sreenidhi.edu.in',
  pass: '20311A1206',
},
  })
  const mailOptions = {
      from: '20311a1206@sreenidhi.edu.in',
      to: mail,
      subject: 'JobForger',
      text: `your account got permenantly removed from the JobForge`,
    };
transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
});

  console.log(resultdoc);
  res.render('../views/adminabout.ejs',{user:req.myusername,employerDetails:resultdoc});
  }
  catch(error)
  {
      console.log(error);
  }

}


const addemployer= async(req,res)=>{
  try{
  const mail=req.query.email;
  const c=await Employerdetail.updateOne({email:mail},{$set: {eligible:true}})
  const transporter=nodemailer.createTransport({
      service: 'gmail',
auth: {
  user: '20311a1206@sreenidhi.edu.in',
  pass: '20311A1206',
},
  })
  const mailOptions = {
      from: '20311a1206@sreenidhi.edu.in',
      to: mail,
      subject: 'JobForger',
      text: `Hurray now your account got approved, now you can upload your job posts in the JobForge `,
    };
transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
});

  console.log(c);
  const resultdoc = await Employerdetail.find({ admin: { $ne: true } });

  console.log(resultdoc);
  res.render('../views/adminabout.ejs',{user:req.myusername,employerDetails:resultdoc});
  }
  catch(error)
  {
      console.log(error);
  }

}
const applicationtrendsdocuments=async(req,res)=>{
  try {
      const timeRange = req.query.timeRange;
      let startDate;

      if (timeRange === 'today') {
          startDate = new Date();
          startDate.setHours(0, 0, 0, 0);
      } else if (timeRange === '5days') {
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 5);
      } else if (timeRange === '10days') {
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 10);
      } else if (timeRange === '1month') {
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
      } else if (timeRange === '2months') {
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 2);
      } else if (timeRange === '3months') {
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 3);
      }

      const documents = await Applicationcollection.aggregate([
          {
              $match: {
                  category: req.query.category,
                  applieddate: { $gte: startDate }
              }
          },
          {
              $group: {
                  _id: { $dateToString: { format: "%Y-%m-%d", date: "$applieddate" } },
                  count: { $sum: 1 }
              }
          },
          {
              $sort: { _id: 1 }
          }
      ]);

      const labels = documents.map(doc => doc._id);
      const documentCounts = documents.map(doc => doc.count);

      res.json({ labels, documentCounts });
  } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}
module.exports={verify,adminabout,adminsendotp,adminloginverifyotp,adminloginconfirmpassword,removeemployer,rejectemployer,addemployer,applicationtrendsdocuments}