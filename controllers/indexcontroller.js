const bcrypt = require('bcrypt');
const express=require("express");
const path=require("path");
const app=express();
require('dotenv').config();
//const session = require("express-session");
const otpGenerator = require('otp-generator')
const multer=require("multer");
const nodemailer=require("nodemailer")
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const mongoose=require("mongoose");
//const { error } = require("console");
//const grid = require('gridfs-stream');
app.use(express.urlencoded({ extended: false ,limit: '50mb'}));
// app.use(express.static(path.join(__dirname,"public")));
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }));
//const {makeconnectionuser,Signupcoll,Corejob,Employerdetail,Applicationcollection,jobschema}=require("../mangoosefile");
//const { stringify } = require('querystring');
const storage=multer.memoryStorage();
//var router = express.Router();
const upload=multer({storage:storage});
var Signupcoll=require("../model/signupcoll");
var {jobschema,Corejob}=require("../model/jobschemacoll");
var Applicationcollection=require("../model/appschemacoll");
//const {protect}=require("../middleware/protect");


const index=async(req, res)=>{
    try {

       if(req.cookies.jwt){
           console.log(req.cookies.jwt);
       const verify = jwt.verify(req.cookies.jwt, "thisismyfirstnodejsexpressmongodbproject");
       console.log("Verification successful: ", verify);
       res.render("../views/about.ejs",{user:verify.name});
       }
       else if(req.cookies.employerjwt)
       {
           console.log(req.cookies.employerjwt);
       const verify = jwt.verify(req.cookies.employerjwt, "thisismyfirstnodejsexpressmongodbproject");
       console.log("Verification successful: ", verify);
       res.render("../views/employerabout.ejs",{user:verify.name});
       }
    //    else if(req.cookies.adminjwt)
    //    {
    //        console.log(req.cookies.adminjwt);
    //    const verify = jwt.verify(req.cookies.adminjwt, "thisismyfirstnodejsexpressmongodbproject");
    //    console.log("Verification successful: ", verify);
    //    res.render("../views/adminabout.ejs",{user:verify.myusername}); 
    //    }
       else{
          
       res.render("../views/index.ejs");
       }
   } catch (error) {
       console.error("JWT verification error: ",error);
       
   }
}
const  signinhandle=async(req,res)=>{
    
    try{
        if(req.cookies.jwt)
        {
        const verify=jwt.verify(req.cookies.jwt,"thisismyfirstnodejsexpressmongodbproject")
    console.log("this is verification"+verify);
    console.log("this is about block");
    console.log(verify.user);
    res.render("../views/about.ejs",{user:verify.name})}
    else{
        console.log("hii");
        res.render("../views/signin.ejs",{message:"signin or singup first"});
        }}
    catch(error)
    {
        console.log(error)
    }}
const applicationformsubmit=async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);
        const jobnamevalue = req.body.jobname;
        console.log(jobnamevalue);

       
        var count = await Applicationcollection.countDocuments({
            email: req.body.email,
            companyname: req.body.companyname,
            jobname: req.body.jobname
        });
    

        if (count == 0) {
            const appdoc = new Applicationcollection({
                name: req.body.name,
                email: req.body.email,
                companyname: req.body.companyname,
                jobname: req.body.jobname,
                phoneno: req.body.phone,
                category: req.body.category,
                coverletter: req.body.coverLetter,
                resume: {
                    data: req.file.buffer,
                    contentType: req.file.mimetype,
                },
                status: "applied"
            });

            const updateinsert = await appdoc.save();
            console.log(updateinsert);

            const collectionname = `${req.body.category}`;
            console.log(collectionname);

            const Jobcollection = mongoose.model(collectionname, jobschema);
            const updatetest = await Jobcollection.updateOne({
                jobname: jobnamevalue,
                companyname: req.body.companyname
            }, {
                $inc: {
                    openings: -1
                }
            });

            const countdoc = await Jobcollection.countDocuments();
            console.log(countdoc);
            console.log(updatetest);

            res.render("../views/status.ejs", {
                status: "success"
            });
        } else {
            res.render("../views/status.ejs", {
                status: "applied"
            });
        }
    } catch (error) {
        console.log(error);
    }
}


const signup = async (req, res) => {
    console.log("this is post method");
    const name1 = req.body.username;
    const email1 = req.body.email;
    const pass1 = req.body.pass;

    try {
        const value = await Signupcoll.countDocuments({ email: email1 });

        if (value > 0) {
            console.log("account already exists");
            res.render("../views/signin.ejs", { message: "you already have an account" });
        } else {
            const doc = new Signupcoll({
                name: name1,
                email: email1,
                pass: pass1
            });

            const token = await doc.generateAuthToken();
            console.log("no token");
            console.log(token);
           
            // res.cookie("jwt", token, {
            //     maxAge: 1000000,
            //     httpOnly: true
            // });

           
            await doc.save();
            
            res.render("../views/signin.ejs", { message: "account done" });
        }
    } catch (error) {
        console.error("Error during signup:", error);
  next(error);
    }
};



const aboutpage=async(req,res)=>{
    const email2=req.body.email1;
   const pass1=req.body.password1;
   const result =await Signupcoll.findOne({email:email2})
   const result1=await Signupcoll.countDocuments({email:email2})
   //const resultn=await db1.find({});
   try{
   if(result1)
   {  
   const result2 = await bcrypt.compare(pass1, result.pass);
   const token= result.tokens[0].token;
   console.log(token)
   if(result2>0)
   {
       res.cookie("jwt",token,{
           maxAge:100000000,
           httpOnly:true
       });
       console.log(email2,pass1,"check");
       res.render('../views/about.ejs',{user:result.name});
   }
   else{
       console.log(email2);
       console.log(pass1);
       console.log(result2);
       console.log(result1);
       res.render('../views/signin.ejs',{message:"wrong password"});
   } 
   }
   else{
       
       console.log(email2);
       console.log(result1);
       res.render('../views/signin.ejs',{message:"you don't have account"});
   }}
   catch (error) {
       console.error('Error comparing passwords:', error);
     }
   
   
}


const searchjob = async (req, res) => {
    try {
        
        const { category, role } = req.body;
        if (!category || !role) {
            return res.status(400).send('NO category or role  got selected');
        }

        console.log(category);
        console.log(role);

       
        const Collectionjob = mongoose.model(`${category}s`, jobschema);

       
        const doc = await Collectionjob.find({ jobname: role });

        console.log(doc);

        
        res.render("../views/searchresult.ejs", {
            category: category,
            role: role,
            documents: doc,
            user: req.myusername
        });
    } catch (error) {
        console.error('Error in searchjob:', error);
        res.status(500).send('Internal server error');
    }
};


const jobs=async(req,res)=>{
    console.log(req.myusername);
     const cat=req.query.category;
     const job=new mongoose.model(`${cat}`,jobschema);
     const data=await job.find();
     res.render("../views/requestedjobs.ejs",{jobdata:data,category:cat,user:req.myusername})
 }
const searchindexjob =async(req,res)=>{
    var query=req.query.myquery;
    var category=req.query.category;
    console.log(category);
    console.log(query);
    let doc;
    if (query.trim() === '') {
        const Collectionjob=mongoose.model(category,jobschema);
        doc = await Collectionjob.aggregate([
            {
              $match: {
                openings: { $gt: 0 },
                lastdate: { $gte: new Date() }
              }
            }
          ]);
        
    }
    else{

        if(category=="softwarejobs"){
        const Collectionjob=mongoose.model(category,jobschema);
        
     doc = await Collectionjob.aggregate([
        {
          $search: {
            index: 'softwarejobindex',
            autocomplete: {
              query: `${query}`,
              path: 'jobname',
              fuzzy: {
                maxEdits: 2
              }
            }
          }
        },
        {
          $match: {
            openings: { $gt: 0 },
            lastdate: { $gte: new Date() }
          }
        }
      ]);
    }
    if(category=="corejobs"){
    const Collectionjob=mongoose.model(category,jobschema);
        
     doc = await Collectionjob.aggregate([
        {
          $search: {
            index: 'corejobindex',
            autocomplete: {
              query: `${query}`,
              path: 'jobname',
              fuzzy: {
                maxEdits: 2
              }
            }
          }
        },
        {
          $match: {
            openings: { $gt: 0 },
            lastdate: { $gte: new Date() }
          }
        }
      ]);
    }
      

}
console.log(doc);
res.send(doc);
}


const about =async(req,res)=>{
    try{
        if(req.cookies.jwt)
        {
            const verify=jwt.verify(req.cookies.jwt,"thisismyfirstnodejsexpressmongodbproject")
    console.log("this is verification"+verify);
    console.log("this is about block");
    console.log(verify.name)
    res.render("../views/about.ejs",{user:verify.name});}
    else{
        console.log("hii");
        res.render("../views/signin.ejs",{message:"signin or singup first"});
        }}
    catch(error)
    {
        console.log(error)
    }
    
        
     }
     const appabout =async(req,res)=>{
        try{
            if(req.cookies.jwt)
            {
                const verify=jwt.verify(req.cookies.jwt,"thisismyfirstnodejsexpressmongodbproject")
        console.log("this is verification"+verify);
        console.log("this is about block");
        console.log(verify.name)
        res.render("../views/about.ejs",{user:verify.name});}
        else{
            console.log("hii");
            res.render("../views/signin.ejs",{message:"signin or singup first"});
            }}
        catch(error)
        {
            console.log(error)
        }
        
            
         }
const logout=(req,res)=>{
        res.clearCookie('jwt');
        res.clearCookie('employerjwt'); 
        res.clearCookie("adminjwt");
       
        res.render('../views/index.ejs'); 
     }


const userdata=(async(req,res)=>{
            console.log("hiiiiiiiiiii");
            
            try{
                let p = await Signupcoll.find();
                console.log(p);
                res.json(p);
            }
            catch(error)
            {
                console.log("error");
            }
           
        })
   const  sendotp =async(req,res)=>{
            console.log(req.body.email);
            const result =await Signupcoll.findOne({email:req.body.email})
            const result1=await Signupcoll.countDocuments({email:req.body.email})
            
            try{
            if(result1)
            {  
            
            const otp1=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
                res.cookie("otp",otp1,{
                    maxAge:60000,
                    httpOnly:true
                });
                const transporter=nodemailer.createTransport({
                            service: 'gmail',
                      auth: {
                        user: process.env.EMAIL,
                        pass:process.env.EMAILPASSWORD,
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
        
                res.render("../views/otppage.ejs",{message:`${req.body.email}`})
            }
         else{
                res.render("../views/signup.ejs",{message:"create account"})
            }
        }catch(error)
        {
            console.log(error);
        }
        
        }

const verifyotp=(req,res)=>{
            const email=req.body.email;
            console.log(req.body);
            const otpValue = req.cookies.otp;
            const enteredotp=req.body.otp;
            console.log("this is"+email);
            if(otpValue==enteredotp){
            res.render("../views/changepassword.ejs",{emailvalue:email,message:""});
            }
            else{
                res.render("../views/forgotpassword.ejs",{message:"wrong otp Access Denied"});
            }
        }
  const  confirmpassword=async (req,res,next)=>{
            if(req.body.confirmPassword==req.body.newPassword)
        {
        console.log(req.body.email);
        console.log(req.body.newPassword);
        const newpassword=req.body.newPassword
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        
            const result1=await Signupcoll.updateOne({email:req.body.email},{$set:{pass:hashedPassword}});
            console.log(result1);
            res.render("../views/signin.ejs",{message:"your password changed "})
          }
        else{
        res.render("../views/changepassword.ejs",{message:"password not match"})
        }}
    const applicationsearch=(req,res)=>{
            try{
                console.log("hieeeeeeeeee")
            res.render("forgotpassword.ejs",{message:"wrong otp Access Denied"})
            }
            catch(error)
            {
                console.log(error)
            }
        }
const viewapplications=async(req,res)=>{
            try{
                if(req.cookies.jwt)
                {
                const verify=jwt.verify(req.cookies.jwt,"thisismyfirstnodejsexpressmongodbproject")
            console.log("this is verification"+verify);
            console.log("this is about block");
            console.log(verify);
            const doc=await Applicationcollection.find({email:verify.email});
            res.render("../views/myapplications.ejs",{applications:doc,user:req.myusername});}
            else{
                console.log("hii");
                res.render("../views/signin.ejs",{message:"signin or singup first"});
                }}
            catch(error)
            {
                console.log(error)
            }
        }

        const corejobsapi=async(req,res)=>{
            console.log("hiiiiiiiiiii");
            
            try{
                let p = await Corejob.find();
                console.log(p);
                res.json(p);
            }
            catch(error)
            {
                console.log(error);
            }
           
        }
      
        
       const softwarejobsapi=async(req,res)=>{
            console.log("hiiiiiiiiiii");
            const Collectionjob=mongoose.model("softwarejobs",jobschema);
            try{
                let p = await Collectionjob.find();
                console.log(p);
                res.json(p);
            }
            catch(error)
            {
                console.log(error);
            }
           
        }
module.exports={index,applicationformsubmit,signup,aboutpage,searchjob,jobs,searchindexjob,about,logout,signinhandle,userdata,sendotp,verifyotp,confirmpassword,applicationsearch,viewapplications,corejobsapi,softwarejobsapi}