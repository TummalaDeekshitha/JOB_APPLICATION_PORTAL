const bcrypt = require('bcrypt');
const express=require("express");
const path=require("path");
const app=express();
const session = require("express-session");
const otpGenerator = require('otp-generator')
const multer=require("multer");
const nodemailer=require("nodemailer")
//app.use(express.static(path.join(__dirname,"public")));
const mongoose=require("mongoose");
const { error } = require("console");
const grid = require('gridfs-stream');
app.use(express.urlencoded({ extended: false ,limit: '50mb'}));
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }));
const {makeconnectionuser,Signupcoll,Corejob,Employerdetail,Applicationcollection,jobschema}=require("../mangoosefile");
const { stringify } = require('querystring');
const storage=multer.memoryStorage();
const upload=multer({storage:storage});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
var router = express.Router();
router.post("/signup",(req,res,next)=>{
    console.log("this is post method");
    const name1=req.body.username;
    const email1=req.body.email;
    const pass1=req.body.pass;
    
     
    const insert=async()=>{
        
        try{
    
        const value=await Signupcoll.countDocuments({email:email1});
        if(value>0)
        {
         console.log("account already exist");
        
          res.render("../views/signin.ejs",{message:"you already have an account"});

        }

    else{
        let namevalue = name1;
        let flag = /^[a-zA-Z0-9]+$/.test(namevalue);
        console.log(namevalue.length)
        if (!flag) {
            res.render("../views/signup.ejs",{message:"username should contain only alphanumerics"});

        }
        else{
            let doc=new Signupcoll({name:name1,
                email: email1,
                pass:pass1});
                const token=doc.generateAuthToken();
                console.log(token);
                res.cookie("jwt",token,{
                    maxAge:100000,
                    httpOnly:true
                    
                })
      // await doc.save();
       
       res.render("../views/about.ejs",{user:name1});
        }
    }}
    catch(error){
        console.log(error)
    }
}

    insert();

    
})
router.post("/signin",async(req,res,next)=>{
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
           maxAge:100000,
           httpOnly:true
       });
       res.render('about.ejs',{user:result.username});
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
       //console.log(resultn);
       console.log(email2);
       console.log(result1);
       res.render('../views/signin.ejs',{message:"you don't have account"});
   }}
   catch (error) {
       console.error('Error comparing passwords:', error);
     }
   
   
})
router.get("/signinhandle",async(req,res,next)=>{
    
    try{
        if(req.cookies.jwt)
        {
            const verify=jwt.verify(req.cookies.jwt,"thisismyfirstnodejsexpressmongodbproject")
    console.log("this is verification"+verify);
    console.log("this is about block");
    console.log(verify.user);
    res.render("../views/about.ejs",{user:verify.username})}
    else{
        console.log("hii");
        res.render("../views/index.ejs",{message:"signin or singup first"});
        }}
    catch(error)
    {
        console.log(error)
    }
    
        
     } )
router.get("/logout",async(req,res)=>{
        res.clearCookie('jwt'); 
        res.redirect('/user/signinhandle'); 
     })
router.get("/jobs",async(req,res)=>{

        const cat=req.query.category;
        const job=new mongoose.model(`${cat}`,jobschema);
        const data=await job.find();
        res.render("../views/requestedjobs.ejs",{jobdata:data,category:cat})
    })
    app.post("/searchjob",async(req,res)=>
{
    console.log(req.body.category);
    console.log(req.body.role);
    const Collectionjob=mongoose.model(`${req.body.category}s`,jobschema);
    //const collectionjob=client.db("jobs").collection(req.body.category);
    const doc=await Collectionjob.find({jobname:req.body.role});
    console.log(doc);
   
    res.render("../views/searchresult.ejs",{ category: req.body.category, role: req.body.role, documents: doc })
})
router.get("/about",async(req,res)=>{
    try{
        if(req.cookies.jwt)
        {
            const verify=jwt.verify(req.cookies.jwt,"thisismyfirstnodejsexpressmongodbproject")
    console.log("this is verification"+verify);
    console.log("this is about block");
    console.log(verify.username)
    res.render("../views/about.ejs",{user:verify.username});}
    else{
        console.log("hii");
        res.render("../views/signin.ejs",{message:"signin or singup first"});
        }}
    catch(error)
    {
        console.log(error)
    }}
)   
router.get("/userdata",(async(req,res)=>{
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
   
})) 
router.post("/sendotp",async(req,res)=>{
    console.log(req.body.email);
    const result =await Signupcoll.findOne({email:req.body.email})
    const result1=await Signupcoll.countDocuments({email:req.body.email})
    //const resultn=await db1.find({});
    try{
    if(result1)
    {  
    
    const otp1=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        res.cookie("otp",otp1,{
            maxAge:10000000,
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

        res.render("../views/otppage.ejs",{message:`${req.body.email}`})
    }
 else{
        res.render("../views/signup.ejs",{message:"create account"})
    }
}catch(error)
{
    console.log(error);
}

})
router.post("/verifyotp",(req,res)=>{
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
})
router.post("/confirmpassword",async (req,res)=>{
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
}})
router.get("/applicationsearch",(req,res)=>{
    try{
        console.log("hieeeeeeeeee")
    res.render("forgotpassword.ejs",{message:"wrong otp Access Denied"})
    }
    catch(error)
    {
        console.log(error)
    }
})
router.get("/corejobsapi",(async(req,res)=>{
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
   
}))
router.get("/governmentjobsapi",(async(req,res)=>{
    console.log("hiiiiiiiiiii");
    const Collectionjob=mongoose.model("governmentjobs",jobschema);
    try{
        let p = await Collectionjob.find();
        console.log(p);
        res.json(p);
    }
    catch(error)
    {
        console.log(error);
    }
   
}))
router.get("/softwarejobsapi",(async(req,res)=>{
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
   
}))
router.post("/applicationformsubmit",upload.single("resume"),async(req,res)=>{
    try{
    console.log(req.body);
    console.log(req.file);
    const jobnamevalue=req.body.jobname;
    console.log(jobnamevalue);
    const count=Applicationcollection.countDocuments({email:req.body.email,companyname:req.body.companyname,jobname:req.body.jobname})
    const appdoc=new Applicationcollection(
        {
            name:req.body.name,
    email:req.body.email,
    companyname:req.body.companyname,
    jobname:req.body.jobname,
    phoneno:req.body.phone,
    category:req.body.category,
    coverletter:req.body.coverLetter,
    resume:{data:req.file.buffer,
         contentType:req.file.mimetype,
        }}
    )
   const updateinsert= await appdoc.save();
   console.log(updateinsert);
    const collectionname=`${req.body.category}s`
    const Jobcollection=new mongoose.model(collectionname,jobschema)
   const updatetest= await Jobcollection.updateOne({jobname:jobnamevalue,companyname:req.body.companyname},{$inc:{openings:-1}});
      console.log(updatetest)
    // res.sendStatus(200);
    res.redirect("/about");

    }
    catch(error)
    {
        console.log(error);
    }
})
module.exports=router;