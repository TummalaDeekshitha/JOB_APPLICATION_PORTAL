const bcrypt = require('bcrypt');
const express=require("express");
const path=require("path");
const app=express();
const session = require("express-session");
const otpGenerator = require('otp-generator')
const multer=require("multer");
const nodemailer=require("nodemailer")
const mongoose=require("mongoose");
const { error } = require("console");
const grid = require('gridfs-stream');
// app.use(express.urlencoded({ extended: false ,limit: '50mb'}));
// app.use(express.static(path.join(__dirname,"public")));
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const bodyParser = require('body-parser');
// app.use(cookieParser())
// app.use(express.json({ limit: '50mb' }));
const { stringify } = require('querystring');
var router = express.Router();
const storage=multer.memoryStorage();
const upload=multer({storage:storage});
app.use(bodyParser.urlencoded({ extended: true }));
const {employerprotect}=require("../middleware/employerprotect");
var {jobschema,Corejob,Softwarejob}=require("../model/jobschemacoll");
var Applicationcollection=require("../model/appschemacoll");
var Employerdetail=require("../model/employerschemacoll");


const employerloginhandler=async(req,res)=>{
    
    try{
        if(req.cookies.employerjwt)
        {
            const verify=jwt.verify(req.cookies.employerjwt,"thisismyfirstnodejsexpressmongodbproject")
    console.log("this is verification"+verify);
    console.log("this is about block");
    console.log(verify.user);
    res.render("../views/employerabout.ejs",{user:verify.name})}
    else{
        console.log("hii");
        res.render("../views/employerlogin.ejs",{message:" "});
        }}
    catch(error)
    {
        console.log(error)
    }
    
        
     }

const employersendotp=async(req,res)=>{
        console.log(req.body.email);
        const result =await Employerdetail.findOne({email:req.body.email})
        const result1=await Employerdetail.countDocuments({email:req.body.email})
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
    
            res.render("../views/employerloginotppage.ejs",{message:`${req.body.email}`})
        }
     else{
            res.render("../views/employerregistration.ejs",{message:"create account"})
        }
    }catch(error)
    {
        console.log(error);
    }
    
    }

   const  employerloginverifyotp = (req,res)=>{
        const email=req.body.email;
        console.log(req.body);
        const otpValue = req.cookies.otp;
        const enteredotp=req.body.otp;
        console.log("this is"+email);
        if(otpValue==enteredotp){
        res.render("../views/employerloginchangepassword.ejs",{emailvalue:email,message:""});
        }
        else{
            res.render("../views/employerforgotpassword.ejs",{message:"wrong otp Access Denied"});
        }
    }
const employerloginconfirmpassword=async (req,res)=>{
        if(req.body.confirmPassword==req.body.newPassword)
{
    console.log(req.body.email);
    console.log(req.body.newPassword);
    const newpassword=req.body.newPassword
    const hashedPassword = await bcrypt.hash(newpassword, 10);

        const result1=await Employerdetail.updateOne({email:req.body.email},{$set:{pass:hashedPassword}});
        console.log(result1);
        res.render("../views/employerlogin.ejs",{message:"your password changed "})
      }
    else{
    res.render("../views/employerloginchangepassword.ejs",{message:"password not match"})
}}

const findcandidate=async(req,res)=>{
    try{let cat="any"
      let  role="any"
      let documents;
      let status=req.query.status;
      if(!req.body.company){
      
       if(req.body.category)
       {
           cat=req.body.category;
       }
       if(req.body.role)
       {
           role=req.body.role;
       }
       if(cat!="any")
       {
           if(role!="any"){
           documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{jobname:role},{status:`${status}`}]})
           }
           else{
           documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{status:`${status}`}]})  ;
           }
       }
       else{
          documents=await Applicationcollection.find({status:`${status}`});
       }
      }
      else{
        if(req.body.category)
        {
            cat=req.body.category;
        }
        if(req.body.role)
        {
            role=req.body.role;
        }
        if(cat!="any")
        {
            if(role!="any"){
            documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{jobname:role},{companyname:company},{status:`${status}`}]})
            }
            else{
            documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{companyname:company},{status:`${status}`}]})  ;
            }
        }
        else{
           documents=await Applicationcollection.find({companyname:company,status:`${status}`});
        }
      }

    const count=documents.length;
    const limit=10;
    let r=count%10;
    let no = (r > 0) ? Math.floor((count / limit) + 1) : Math.floor(count / limit);
   console.log(count);
   console.log(no);
   res.render("../views/matchcandidates.ejs",{totalPages:no,Category:cat,Job:role,status:`${status}`,user:req.myusername})
   }
   catch(error)
   {
   console.log(error);
   }
       
   }

  const  findcandidatecompany=async(req,res)=>{
    try{let cat="any"
      let  role="any"
      let documents;
      let status1=req.query.status;
       var company=req.query.company;
        if(req.query.category)
        {
            cat=req.query.category;
        }
        if(req.query.role)
        {
            role=req.query.job;
        }
        if(cat!="any")
        {
            if(role!="any"){
            documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{jobname:role,companyname:company,status:`${status1}`}]})
            }
            else{
            documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{companyname:company,status:`${status1}`}]})  ;
            }
        }
        else{
           documents=await Applicationcollection.find({companyname:company,status:`${status1}`});
        }
      

    const count=documents.length;
    const limit=10;
    let r=count%10;
    let no = (r > 0) ? Math.floor((count / limit) + 1) : Math.floor(count / limit);
   console.log(count);
   console.log(no);
   res.render("../views/allmatched.ejs",{totalPages:no,Category:cat,Job:role,company:company,status:`${status1}`,user:req.myusername})
   }
   catch(error)
   {
   console.log(error);
   }
       
   }


   const mypostfindcandidatecompany =async(req,res)=>{
    try{let cat="any"
      let  role="any"
      let documents;
      let status=req.query.status;
       var company=req.query.company;

        if(req.query.category)
        {
            cat=req.query.category;
        }
        if(req.query.role)
        {
            role=req.query.job;
        }
        console.log(`${status},${company},${role},${cat}`)
        if(cat!="any")
        {
            if(role!="any"){
            documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{jobname:role,companyname:company,status:`${status}`}]})
            }
            else{
            documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{companyname:company,status:`${status}`}]})  ;
            }
        }
        else{
           documents=await Applicationcollection.find({companyname:company,status:`${status}`});
        }
      

    const count=documents.length;
    const limit=10;
    let r=count%10;
    let no = (r > 0) ? Math.floor((count / limit) + 1) : Math.floor(count / limit);
   console.log(count);
   console.log(no);
   res.render("../views/mypostapplication.ejs",{totalPages:no,Category:cat,Job:role,company:company, status:`${status}`,user:req.myusername})
   }
   catch(error)
   {
   console.log(error);
   }
       
   }


  const getDocuments=async(req,res)=>{
     
    try {
        // const s=await Applicationcollection.deleteMany({$or:[{resume:{$exists:false}},{category:{$exists:false}}]});
     //console.log(s);
    //  const s=await Applicationcollection.find();
    //  const s1=await Applicationcollection.insertMany();
     //console.log(s1);
        const pno = req.query.page; 
        const role = req.query.job;
        const skip = (pno - 1) * 10;
        const status=req.query.status;
       
        let documents;
    
        if(cat!="any")
        {
            if(role!="any"){
            documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{jobname:role},{status:`${status}`}]}).sort({applieddate:1}).skip(skip).limit(10)
            }

            else{
            documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{status:`${status}`}]}).sort({applieddate:1}).skip(skip).limit(10)  ;
            }
        }
        else{
           documents=await Applicationcollection.find({status:`${status}`}).sort({applieddate:1}).skip(skip).limit(10);
        }
        if (documents && documents.length > 0) {
          res.json(documents);
        } else {
          
          res.status(404).json({ error: "No documents found" });
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }

    
}


const getDocumentscompany=async(req,res)=>{
     
    try {
        // const s=await Applicationcollection.deleteMany({$or:[{resume:{$exists:false}},{category:{$exists:false}}]});
     //console.log(s);
    //  const s=await Applicationcollection.find();
    //  const s1=await Applicationcollection.insertMany();
     //console.log(s1);
        const pno = req.query.page; 
        const cat = req.query.category;
        const role = req.query.job;
        const company=req.query.company;
        const status=req.query.status;
        const skip = (pno - 1) * 10;
        
       
        let documents;
    
        if(cat!="any")
        {
            if(role!="any"){
            documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{jobname:role},{companyname:company,status:`${status}`}]}).sort({applieddate:1}).skip(skip).limit(10)
            }
  
            else{
            documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{companyname:company,status:`${status}`}]}).sort({applieddate:1}).skip(skip).limit(10)  ;
            }
        }
        else{
           documents=await Applicationcollection.find({companyname:company,status:`${status}`}).sort({applieddate:1}).skip(skip).limit(10);
        }
        if (documents && documents.length > 0) {
          res.json(documents);
        } 
        else {
          
          res.status(404).json({ error: "No documents found" });
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
  }

  const getCompanySuggestions= async (req, res) => {
    try {
      const status=req.query.status;
      const query = req.query.query;
      const cat = req.query.category;
      const role = req.query.job;
      const regex = new RegExp(`^${query}`, 'i');
  
      if (!query) {
        return res.json([]);
      }
  
      let documents;
  
      if (cat !== "any") {
        if (role !== "any") {
          documents = await Applicationcollection.aggregate([
            {
              $match: { $and: [{ $or: [{ category: cat }, { category: `${cat}s` }] }, { jobname: role }, { companyname: regex },{status:`${status}`}] }
            },
            {
              $group: {
                _id: "$companyname"
              }
            },
            {
              $limit: 10
            }
          ]);
        } else {
          documents = await Applicationcollection.aggregate([
            {
              $match: { $and: [{ $or: [{ category: cat }, { category: `${cat}s` }] }, { companyname: regex },{status:`${status}`}] }
            },
            {
              $group: {
                _id: "$companyname"
              }
            },
            {
              $7000limit: 10
            }
          ]);
        }
      } else {
        documents = await Applicationcollection.aggregate([
          {
            $match: { companyname: regex ,status:`${status}`}
          },
          {
            $group: {
              _id: "$companyname"
            }
          },
          {
            $limit: 10
          }
        ]);
      }
  
      if (documents && documents.length > 0) {
        const companyNames = documents.map(doc => doc._id);
        console.log("Found documents:", companyNames);
        return res.json(companyNames);
      } else {
        console.log("No documents found");
        return res.json([]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

 const viewResumelink=async (req, res) => {
    try {
      const id = req.query.id;
      const doc = await Applicationcollection.findOne({ _id: id });
  
      if (!doc) {
        
        return res.status(404).send("Document not found");
      }
  
      res.render("displayresume.ejs", { doc: doc });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

const sendmail=(req,res)=>
  {
    try{
      if(req.cookies.employerjwt)
      {
          const verify=jwt.verify(req.cookies.employerjwt,"thisismyfirstnodejsexpressmongodbproject")
  console.log("this is verification"+verify);
  console.log(req.query.email);
  console.log(verify.email);
  
  res.render("../views/mail.ejs",{from:verify.email ,to:req.query.email,Category:req.query.category,Job:req.query.job,company:req.query.company})}
  else{
      console.log("hii");
      res.render("../views/employerlogin.ejs",{message:"Sorry your session timeout please do login"});
      }}
  catch(error)
  {
      console.log(error)
  }
  
   
  }

const submitmail=(req,res)=>{
 
    const to=req.body.to;
    const subject=req.body.subject;
    const body=req.body.body;
    console.log("hiii");
    console.log(req.query.job);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '20311a1206@sreenidhi.edu.in', 
        pass: '20311A1206'
      },
    });
    console.log(to)
  
    const mailOptions = {
      from: '20311A1206@sreenidhi.edu.in',
      to: to,
      subject: subject,
      text: body,
      attachments: req.file ? [{ filename: req.file.originalname, content: req.file.buffer }] : [],
    };
  
    transporter.sendMail(mailOptions, async(error, info) => {
      if (error) {
        console.error(error);
        res.render("../views/emailerror.ejs")
      } else {
        console.log('Email sent: ' + info.response);
        var c= await Applicationcollection.updateOne({email:to,companyname:req.query.company,jobname:req.query.job,category:req.query.category},{$set:{status:"approved"}})
        console.log(c);
       res.render("../views/emailsendsuccess.ejs")
      }
    });
  }

  const jobpost=(req,res)=>{
    if(req.cookies.employerjwt)
    {
        const verify=jwt.verify(req.cookies.employerjwt,"thisismyfirstnodejsexpressmongodbproject")
  console.log("this is verification"+verify);
  console.log("this is about block");
  console.log(verify.email)
  res.render("../views/postjob.ejs",{email:verify.email,user:req.myusername});}
      
  else{
    res.render("../views/employerlogin.ejs")
  }
  }

  const postjob=async(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    let Samplemodel=mongoose.model(`${req.body.category}s`,jobschema);
    let doc=new Samplemodel({
         
        companyname:req.body.companyname,
        jobname:req.body.jobname,
        totalapplications:req.body.openings,
       openings: req.body.openings,
      lastdate:new Date(req.body.lastdate),
     description:req.body.description,
    logo:{
        data:req.file.buffer,
        contentType:req.file.mimetype
    },
   employeremail:req.body.email
  })
    await doc.save();
    res.redirect("/");
  }

const viewyourposts=async(req,res)=>{
    if(req.cookies.employerjwt)
    {
        const verify=jwt.verify(req.cookies.employerjwt,"thisismyfirstnodejsexpressmongodbproject")
  console.log("this is verification"+verify);
  console.log("this is about block");
  console.log(verify.email);
  var software=await Softwarejob.find({employeremail:verify.email})
  var core=await Corejob.find({employeremail:verify.email})
  res.render("../views/myposts.ejs",{softwareposts :software,coreposts:core,user:verify.name});
   }
  
    else{
      res.render("../views/employerlogin.ejs",{message:"session time out"})
    }
  
  
  }
const removepost=async(req,res)=>
{
    const cat =req.query.category;
    const id=req.query.id;
    const mymodel=mongoose.model(`${cat}s`,jobschema);
    const r=await mymodel.deleteOne({_id:id});
  var software=await Softwarejob.find({employeremail:req.myemail})
  var core=await Corejob.find({employeremail:req.myemail})
  res.render("../views/myposts.ejs",{softwareposts :software,coreposts:core,user:req.myusername});

}

  const employerlogin=async(req,res)=>{
    
    
    const email2=req.body.email1;
    const pass1=req.body.password1;
    const result =await Employerdetail.findOne({email:email2,eligible:true})
    const result1=await Employerdetail.countDocuments({email:email2,eligible:true})
    //const resultn=await db1.find({});
    try{
    if(result1)
    {  
    const result2 = await bcrypt.compare(pass1, result.pass);
    const token= result.tokens[0].token;
    console.log(token)
    if(result2>0)
    {
        res.cookie("employerjwt",token,{
            maxAge:10000000,
            httpOnly:true
        });
        res.render('../views/employerabout.ejs',{user:result.name});
    }
    else{
        console.log(email2);
        console.log(pass1);
        console.log(result2);
        console.log(result1);
        res.render('../views/employerlogin.ejs',{message:"wrong password"});
    } 
    }
    else{
        //console.log(resultn);
        console.log(email2);
        console.log(result1);
        res.render('../views/employerlogin.ejs',{message:"you don't have account"});
    }}
    catch (error) {
        console.error('Error comparing passwords:', error);
      }
    
    
}

module.exports={removepost,employerlogin,employerloginhandler,employersendotp,employerloginverifyotp,employerloginconfirmpassword,findcandidate,findcandidatecompany,mypostfindcandidatecompany,getDocuments,getDocumentscompany,getCompanySuggestions,viewResumelink,sendmail,submitmail,jobpost,postjob,viewyourposts}