const express=require("express");
// const path=require("path");
// const app=express();
// const session = require("express-session");
// const otpGenerator = require('otp-generator')
 const multer=require("multer");
// const nodemailer=require("nodemailer")
 const mongoose=require("mongoose");
// const { error } = require("console");
// const grid = require('gridfs-stream');
// // app.use(express.urlencoded({ extended: false ,limit: '50mb'}));
// // app.use(express.static(path.join(__dirname,"public")));
// const jwt=require("jsonwebtoken")
// const cookieParser=require("cookie-parser")
// const bodyParser = require('body-parser');
// // app.use(cookieParser())
// // app.use(express.json({ limit: '50mb' }));
// const { stringify } = require('querystring');
 var router = express.Router();
 const storage=multer.memoryStorage();
 const upload=multer({storage:storage});
// app.use(bodyParser.urlencoded({ extended: true }));
 const {employerprotect}=require("../middleware/employerprotect");
// var {jobschema,Corejob,Softwarejob}=require("../model/jobschemacoll");
// var Applicationcollection=require("../model/appschemacoll");
// var Employerdetail=require("../model/employerschemacoll");
const {removepost,employerlogin,employerloginhandler,employersendotp,employerloginverifyotp,employerloginconfirmpassword,findcandidate,findcandidatecompany,mypostfindcandidatecompany,getDocuments,getDocumentscompany,getCompanySuggestions,viewResumelink,sendmail,submitmail,jobpost,postjob,viewyourposts}=require("../controllers/employerlogincontroller.js")
router.post("/employerlogin",employerlogin);

router.get("/employerloginhandler",employerloginhandler)

router.get("/employerforgotpassword",(req,res)=>{
    res.render("employerforgotpassword.ejs");
})

router.post("/employersendotp",employersendotp)
router.post("/employerloginverifyotp",employerloginverifyotp)

router.post("/employerloginconfirmpassword",employerloginconfirmpassword)
    // const newjobschema=new mongoose.Schema({
    //     companyname:{type:String,required:true
    //     },
    //     jobname:{type:String,
    //         required:true},

    // openings: {type:Number,
    //         required:true},
    // lastdate:{type:String,
    //           required:true},
    //  description:{
    //     type:String,
    //     required:true
    //  },
    // logo:{
    //     data:Buffer,
    //     contentType:String

    // }
    //   })
router.get("/removepost",employerprotect,removepost);
router.post("/findcandidate",employerprotect,findcandidate)
router.get("/findcandidatecompany",employerprotect,findcandidatecompany)
   router.get("/mypostfindcandidatecompany",employerprotect,mypostfindcandidatecompany)
   router.get("/getDocuments",employerprotect,getDocuments)
router.get("/getDocumentscompany",employerprotect,getDocumentscompany)
router.get("/getCompanySuggestions",employerprotect, getCompanySuggestions);
router.get("/viewResumelink",employerprotect,viewResumelink);
router.get("/sendmail",employerprotect,sendmail)

router.post("/submitmail",upload.single('attachment'),employerprotect,submitmail);
router.get("/jobpost",employerprotect,jobpost)
router.post("/postjob",upload.single("logo"),employerprotect,postjob)

// const start=async()=>{
// try{
//   app.listen(5000,()=>{
//       console.log("hurray u got connected");
//   })
//   //deekshithareddy2223
//   //gXkPedRi3ZJadM22
  
  
// }
// catch(error)
// {
//   console.log(error)

// }
// }
router.get("/viewyourposts",employerprotect,viewyourposts)
// router.get("/employerlogout",(req,res)=>{
//   res.clearCookie('employerjwt'); 
//     res.render('../views/index.ejs'); 
// })


module.exports=router
