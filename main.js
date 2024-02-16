const bcrypt = require('bcrypt');
const express=require("express");
const path=require("path");
const app=express();

const session = require("express-session");
const otpGenerator = require('otp-generator')
const multer=require("multer");
const nodemailer=require("nodemailer")
//app.use(express.static(path.join(__dirname,"public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const mongoose=require("mongoose");
const { error } = require("console");
const grid = require('gridfs-stream');
app.use(express.urlencoded({ extended: false ,limit: '50mb'}));
app.use(express.static(path.join(__dirname,"public")));
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }));
//const {makeconnectionuser,Signupcoll,Corejob,Employerdetail,Applicationcollection,jobschema}=require("./mangoosefile");
var connectDB=require("./mangoosefile.js");
const { stringify } = require('querystring');
const storage=multer.memoryStorage();
const upload=multer({storage:storage});
const {uploadfile,getfilestream}=require('./s3')
connectDB();
var indexrouter=require('./routes/index.js')
// app.use(
//     session({
//       secret: "thisismyfirstnodejsexpressmongodbproject", 
//       resave: false,
//       saveUninitialized: true,
//       cookie: { secure: false },
//     })
//   );
 
var employerrouter=require('./routes/employer.js')
var employerlogin=require('./routes/employerlogin.js')
var admin=require("./routes/admin.js")
console.log(path.join(__dirname,"public"));
app.use('/',indexrouter);
app.use('/employer',employerrouter);
app.use('/employerlogin',employerlogin);
app.use("/admin",admin);
app.get('/images/:key',(req,res)=>{
    console.log(req.params);
    const key=req.params.key
    const readstream=getfilestream(key)
    readstream.pipe(res);
})
const start=async()=>{
    try{
        app.listen(7002,()=>{
            console.log("hurray u got connected");
        })
        
        
    }
    catch(error)
    {
        console.log(error)

    }
}
start();




// app.post("/applicationform'submit",upload.single("resume"),async(req,res)=>{
//     try{
//     console.log(req.body);
//     console.log(req.file);
//     const jobnamevalue=req.body.jobname;
//     console.log(jobnamevalue);
//     const count=Applicationcollection.countDocuments({email:req.body.email,companyname:req.body.companyname,jobname:req.body.jobname})
//     const appdoc=new Applicationcollection(
//         {
//             name:req.body.name,
//     email:req.body.email,
//     companyname:req.body.companyname,
//     jobname:req.body.jobname,
//     phoneno:req.body.phone,
//     category:req.body.category,
//     coverletter:req.body.coverLetter,
//     resume:{data:req.file.buffer,
//          contentType:req.file.mimetype,
//         }}
//     )
//    const updateinsert= await appdoc.save();
//    console.log(updateinsert);
//     const collectionname=`${req.body.category}s`
//     const Jobcollection=new mongoose.model(collectionname,jobschema)
//    const updatetest= await Jobcollection.updateOne({jobname:jobnamevalue,companyname:req.body.companyname},{$inc:{openings:-1}});
//       console.log(updatetest)
//     // res.sendStatus(200);
//     res.redirect("/about");

//     }
//     catch(error)
//     {
//         console.log(error);
//     }
// })
// app.post("/findcandidate",async(req,res)=>{
//  try{let cat="any"
//    let  role="any"
//    let documents;
//     if(req.body.category)
//     {
//         cat=req.body.category;
//     }
//     if(req.body.role)
//     {
//         role=req.body.role;
//     }
//     if(cat!="any")
//     {
//         if(role!="any"){
//         documents=await Applicationcollection.find({$and: [{$or:[{category:cat},{category:`${cat}s`}]},{jobname:role}]})
//         }
//         else{
//         documents=await Applicationcollection.find({$or: [{category:cat},{category:`${cat}s`}]})  ;
//         }
//     }
//     else{
//        documents=await Applicationcollection.find();
//     }
//  const count=documents.length;
//  const limit=10;
//  let r=count%10;
//  let no=(r>0)?((count/limit)+1):((count/limit));
// res.render("../views/matchcandidates.ejs",{totalPages:no})
// }
// catch(error)
// {
// console.log(error);
// }
    
// })

// app.get("/jobs",async(req,res)=>{

//     const cat=req.query.category;
//     const job=new mongoose.model(`${cat}`,jobschema);
//     const data=await job.find();
//     res.render("../views/requestedjobs.ejs",{jobdata:data,category:cat})
// })
// app.post("/signin",async(req,res)=>{
//      const email2=req.body.email1;
//     const pass1=req.body.password1;
//     const result =await Signupcoll.findOne({email:email2})
//     const result1=await Signupcoll.countDocuments({email:email2})
//     //const resultn=await db1.find({});
//     try{
//     if(result1)
//     {  
//     const result2 = await bcrypt.compare(pass1, result.pass);
//     const token= result.tokens[0].token;
//     console.log(token)
//     if(result2>0)
//     {
//         res.cookie("jwt",token,{
//             maxAge:100000,
//             httpOnly:true
//         });
//         res.render('../views/about.ejs',{user:result.username});
//     }
//     else{
//         console.log(email2);
//         console.log(pass1);
//         console.log(result2);
//         console.log(result1);
//         res.render('../views/signin.ejs',{message:"wrong password"});
//     } 
//     }
//     else{
//         //console.log(resultn);
//         console.log(email2);
//         console.log(result1);
//         res.render('../views/signin.ejs',{message:"you don't have account"});
//     }}
//     catch (error) {
//         console.error('Error comparing passwords:', error);
//       }
    
    
// })
// app.post("/searchjob",async(req,res)=>
// {
//     console.log(req.body.category);
//     console.log(req.body.role);
//     const Collectionjob=mongoose.model(`${req.body.category}s`,jobschema);
//     //const collectionjob=client.db("jobs").collection(req.body.category);
//     const doc=await Collectionjob.find({jobname:req.body.role});
//     console.log(doc);
   
//     res.render("../views/searchresult.ejs",{ category: req.body.category, role: req.body.role, documents: doc })
// })
// app.get("/about",async(req,res)=>{
// try{
//     if(req.cookies.jwt)
//     {
//         const verify=jwt.verify(req.cookies.jwt,"thisismyfirstnodejsexpressmongodbproject")
// console.log("this is verification"+verify);
// console.log("this is about block");
// console.log(verify.username)
// res.render("../views/about.ejs",{user:verify.username});}
// else{
//     console.log("hii");
//     res.render("../views/signin.ejs",{message:"signin or singup first"});
//     }}
// catch(error)
// {
//     console.log(error)
// }

    
//  } )
//  app.get("/logout",async(req,res)=>{
//     res.clearCookie('jwt'); 
//     res.redirect('/signinhandle'); 
//  })
//  app.get("/signinhandle",async(req,res)=>{
    
//     try{
//         if(req.cookies.jwt)
//         {
//             const verify=jwt.verify(req.cookies.jwt,"thisismyfirstnodejsexpressmongodbproject")
//     console.log("this is verification"+verify);
//     console.log("this is about block");
//     console.log(verify.user);
//     res.render("../views/about.ejs",{user:verify.username})}
//     else{
//         console.log("hii");
//         res.render("../views/signin.ejs",{message:"signin or singup first"});
//         }}
//     catch(error)
//     {
//         console.log(error)
//     }
    
        
//      } )


// app.get("/userdata",(async(req,res)=>{
//     console.log("hiiiiiiiiiii");
    
//     try{
//         let p = await Signupcoll.find();
//         console.log(p);
//         res.json(p);
//     }
//     catch(error)
//     {
//         console.log("error");
//     }
   
// }))
// app.post("/sendotp",async(req,res)=>{
//     console.log(req.body.email);
//     const result =await Signupcoll.findOne({email:req.body.email})
//     const result1=await Signupcoll.countDocuments({email:req.body.email})
//     //const resultn=await db1.find({});
//     try{
//     if(result1)
//     {  
    
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

//         res.render("../views/otppage.ejs",{message:`${req.body.email}`})
//     }
//  else{
//         res.render("../views/signup.ejs",{message:"create account"})
//     }
// }catch(error)
// {
//     console.log(error);
// }

// })
// app.post("/verifyotp",(req,res)=>{
//     const email=req.body.email;
//     console.log(req.body);
//     const otpValue = req.cookies.otp;
//     const enteredotp=req.body.otp;
//     console.log("this is"+email);
//     if(otpValue==enteredotp){
//     res.render("../views/changepassword.ejs",{emailvalue:email,message:""});
//     }
//     else{
//         res.render("../views/forgotpassword.ejs",{message:"wrong otp Access Denied"});
//     }
// })
// app.post("/confirmpassword",async (req,res)=>{
//     if(req.body.confirmPassword==req.body.newPassword)
// {
// console.log(req.body.email);
// console.log(req.body.newPassword);
// const newpassword=req.body.newPassword
// const hashedPassword = await bcrypt.hash(newpassword, 10);

//     const result1=await Signupcoll.updateOne({email:req.body.email},{$set:{pass:hashedPassword}});
//     console.log(result1);
//     res.render("../views/signin.ejs",{message:"your password changed "})
//   }
// else{
// res.render("../views/changepassword.ejs",{message:"password not match"})
// }})
// app.get("/applicationsearch",(req,res)=>{
//     try{
//         console.log("hieeeeeeeeee")
//     res.render("forgotpassword.ejs",{message:"wrong otp Access Denied"})
//     }
//     catch(error)
//     {
//         console.log(error)
//     }
// })
// app.get("/corejobsapi",(async(req,res)=>{
//     console.log("hiiiiiiiiiii");
    
//     try{
//         let p = await Corejob.find();
//         console.log(p);
//         res.json(p);
//     }
//     catch(error)
//     {
//         console.log(error);
//     }
   
// }))
// app.get("/governmentjobsapi",(async(req,res)=>{
//     console.log("hiiiiiiiiiii");
//     const Collectionjob=mongoose.model("governmentjobs",jobschema);
//     try{
//         let p = await Collectionjob.find();
//         console.log(p);
//         res.json(p);
//     }
//     catch(error)
//     {
//         console.log(error);
//     }
   
// }))
// app.get("/softwarejobsapi",(async(req,res)=>{
//     console.log("hiiiiiiiiiii");
//     const Collectionjob=mongoose.model("softwarejobs",jobschema);
//     try{
//         let p = await Collectionjob.find();
//         console.log(p);
//         res.json(p);
//     }
//     catch(error)
//     {
//         console.log(error);
//     }
   
// }))
     
// // this is end of user 
// // Ssignin,
// // signup,
// // jobapplicaion,
// // jobsearch


// //start of employer rigistration where otp will be sended to verify email before completion of registration


// app.post("/registeremployer",async(req,res)=>{
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
// app.get("/resendotp",(req,res)=>{
//     let email1=req.query.email;
//     console.log(email1)
        
//         try{
//         const otp1=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
//             res.cookie("otp",otp1,{
//                 maxAge:10000000,
//                 httpOnly:true
//             });
//             const transporter=nodemailer.createTransport({
//                         service: 'gmail',
//                   auth: {
//                     user: '20311a1206@sreenidhi.edu.in',
//                     pass: '20311A1206',
//                   },
//                     })
//                     const mailOptions = {
//                         from: '20311a1206@sreenidhi.edu.in',
//                         to: email1,
//                         subject: 'JobForger',
//                         text: `your OTP : ${otp1}\n `,
//                       };
//                  transporter.sendMail(mailOptions, (error, info) => {
//                         if (error) {
//                           console.error('Error sending email:', error);
//                         } else {
//                           console.log('Email sent:', info.response);
//                         }
//                 });
     
     
//             res.render("../views/otppage.ejs",{message:`${email1}`,message2:"OTP got resend"})
//         }
//         catch(error)
//         {
//             console.log(error);
//         }
          
//     })

// app.post("/verifyotp",(req,res)=>{
//     const email=req.body.email;
//     console.log(req.body);
//     const otpValue = req.cookies.otp;
//     const enteredotp=req.body.otp;
//     console.log("this is"+email);
//     if(otpValue==enteredotp){
//     // let doc=new Employerdetail({
//     //     name:req.body.name,
//     //         companyname:req.body.companyname,
//     //         email:req.body.email,
//     //         pass:req.body.pass,
//     //         industry:req.body.industry,
//     //         employeridnumber:req.body.employeridnumber,
//     //         aadharnumber:req.body.aadharnumber,

//     // })
//     const insert=async()=>{
        
//         try{
    
//         const value=await Employerdetail.countDocuments({email:req.body.email});
//         if(value>0)
//         {
//          console.log("account already exist");
        
//           res.render("../views/employerlogin.ejs",{message:"you already have an account"});

//         }

//     else{
//         let doc=new Employerdetail({
//                 name:req.body.name,
//                     companyname:req.body.companyname,
//                     email:req.body.email,
//                     pass:req.body.pass,
//                     industry:req.body.industry,
//                     employeridnumber:req.body.employeridnumber,
//                     aadharnumber:req.body.aadharnumber,
        
//             })
//                 const token=doc.generateAuthToken();
//                 console.log(token);
//                 res.cookie("employerjwt",token,{
//                     maxAge:100000,
//                     httpOnly:true
                    
//                 })
//       // await doc.save();
//        console.log("document saved")
//        res.render("../views/employerlogin.ejs",{message:"your account got created"});
//         }
//     }
//     catch(error){
//         console.log(error)
//     }
// }

//     insert();
// }
//     else{
//         res.render("../views/employerotppage.ejs",{email1:`${req.body.email}`,name1:`${req.body.name}`,companyname1:`${req.body.companyname}`,password1:`${req.body.pass}`,industry1:`${req.body.industry}`,employerid1:`${req.body.employeridnumber}`,aadharno1:`${req.body.aadharnumber}`,message2:"wrong otp"})
//     }
// })
// // end of registration routes
// // start of employerlogin routes
// // similar to user login


// app.post("/employerlogin",async(req,res)=>{
    
    
//     const email2=req.body.email1;
//     const pass1=req.body.password1;
//     const result =await Employerdetail.findOne({email:email2})
//     const result1=await Employerdetail.countDocuments({email:email2})
//     //const resultn=await db1.find({});
//     try{
//     if(result1)
//     {  
//     const result2 = await bcrypt.compare(pass1, result.pass);
//     const token= result.tokens[0].token;
//     console.log(token)
//     if(result2>0)
//     {
//         res.cookie("employerjwt",token,{
//             maxAge:100000,
//             httpOnly:true
//         });
//         res.render('../views/employerabout.ejs',{user:result.name});
//     }
//     else{
//         console.log(email2);
//         console.log(pass1);
//         console.log(result2);
//         console.log(result1);
//         res.render('../views/employerlogin.ejs',{message:"wrong password"});
//     } 
//     }
//     else{
//         //console.log(resultn);
//         console.log(email2);
//         console.log(result1);
//         res.render('../views/employerlogin.ejs',{message:"you don't have account"});
//     }}
//     catch (error) {
//         console.error('Error comparing passwords:', error);
//       }
    
    
// })
// app.get("/employerloginhandler",async(req,res)=>{
    
//     try{
//         if(req.cookies.employerjwt)
//         {
//             const verify=jwt.verify(req.cookies.employerjwt,"thisismyfirstnodejsexpressmongodbproject")
//     console.log("this is verification"+verify);
//     console.log("this is about block");
//     console.log(verify.user);
//     res.render("../views/employerabout.ejs",{user:verify.email})}
//     else{
//         console.log("hii");
//         res.render("../views/employerlogin.ejs",{message:" "});
//         }}
//     catch(error)
//     {
//         console.log(error)
//     }
    
        
//      } )
//  app.post("/employersendotp",async(req,res)=>{
//         console.log(req.body.email);
//         const result =await Employerdetail.findOne({email:req.body.email})
//         const result1=await Employerdetail.countDocuments({email:req.body.email})
//         //const resultn=await db1.find({});
//         try{
//         if(result1)
//         {  
        
//         const otp1=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
//             res.cookie("otp",otp1,{
//                 maxAge:10000000,
//                 httpOnly:true
//             });
//             const transporter=nodemailer.createTransport({
//                         service: 'gmail',
//                   auth: {
//                     user: '20311a1206@sreenidhi.edu.in',
//                     pass: '20311A1206',
//                   },
//                     })
//                     const mailOptions = {
//                         from: '20311a1206@sreenidhi.edu.in',
//                         to: req.body.email,
//                         subject: 'JobForger',
//                         text: `your OTP : ${otp1}\n `,
//                       };
//                  transporter.sendMail(mailOptions, (error, info) => {
//                         if (error) {
//                           console.error('Error sending email:', error);
//                         } else {
//                           console.log('Email sent:', info.response);
//                         }
//                 });
    
//             res.render("../views/employerloginotppage.ejs",{message:`${req.body.email}`})
//         }
//      else{
//             res.render("../views/employerregistration.ejs",{message:"create account"})
//         }
//     }catch(error)
//     {
//         console.log(error);
//     }
    
//     })
//  app.post("/employersloginverifyotp",(req,res)=>{
//         const email=req.body.email;
//         console.log(req.body);
//         const otpValue = req.cookies.otp;
//         const enteredotp=req.body.otp;
//         console.log("this is"+email);
//         if(otpValue==enteredotp){
//         res.render("../views/employerloginchangepassword.ejs",{emailvalue:email,message:""});
//         }
//         else{
//             res.render("../views/employerloginforgotpassword.ejs",{message:"wrong otp Access Denied"});
//         }
//     })

// app.post("/employerloginconfirmpassword",async (req,res)=>{
//         if(req.body.confirmPassword==req.body.newPassword)
// {
//     console.log(req.body.email);
//     console.log(req.body.newPassword);
//     const newpassword=req.body.newPassword
//     const hashedPassword = await bcrypt.hash(newpassword, 10);

//         const result1=await Employerdetail.updateOne({email:req.body.email},{$set:{pass:hashedPassword}});
//         console.log(result1);
//         res.render("../views/employerlogin.ejs",{message:"your password changed "})
//       }
//     else{
//     res.render("../views/employerloginchangepassword.ejs",{message:"password not match"})
//     }})
//     const newjobschema=new mongoose.Schema({
//         companyname:{type:String,required:true
//         },
//         jobname:{type:String,
//             required:true},

//     openings: {type:Number,
//             required:true},
//     lastdate:{type:String,
//               required:true},
//      description:{
//         type:String,
//         required:true
//      },
//     logo:{
//         data:Buffer,
//         contentType:String

//     }
     // })
// app.post("/postjob",upload.single("logo"),async(req,res)=>{
//         console.log(req.body);
//         console.log(req.file);
//         let Samplemodel=mongoose.model(`${req.body.category}s`,jobschema);
//         let doc=new Samplemodel({
//             companyname:req.body.companyname,
//             jobname:req.body.jobname,
    
//         openings: req.body.openings,
//         lastdate:req.body.lastdate,
//          description:req.body.description,
//         logo:{
//             data:req.file.buffer,
//             contentType:req.file.mimetype
//         }

//         })
//         await doc.save();
//         res.redirect("/");
//     })

// const start=async()=>{
//     try{
//         app.listen(5000,()=>{
//             console.log("hurray u got connected");
//         })
//         //deekshithareddy2223
//         //gXkPedRi3ZJadM22
        
        
//     }
//     catch(error)
//     {
//         console.log(error)

//     }
// }
// start();




