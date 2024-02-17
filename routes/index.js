// const bcrypt = require('bcrypt');
 const express=require("express");
// const path=require("path");
// const app=express();

// const session = require("express-session");
// const otpGenerator = require('otp-generator')
 const multer=require("multer");
// const nodemailer=require("nodemailer")
// app.use(express.static(path.join(__dirname,"public")));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

const mongoose=require("mongoose");
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
 const storage=multer.memoryStorage();
 var router = express.Router();
 const upload=multer({storage:storage});
// var Signupcoll=require("../model/signupcoll");
// var {jobschema,Corejob}=require("../model/jobschemacoll");
 var Applicationcollection=require("../model/appschemacoll");
const {protect}=require("../middleware/protect");
const {index,applicationformsubmit,signup,aboutpage,searchjob,jobs,searchindexjob,about,logout,signinhandle,userdata,sendotp,verifyotp,confirmpassword,applicationsearch,viewapplications,corejobsapi,softwarejobsapi}=require("../controllers/indexcontroller.js");

router.get('/',index)
// router.get("/universalapplicationform",(req,res)=>{
//     try{

//        const category=req.query.category;
//        const job=req.query.jobname;
//        const company=req.query.companyname;
//        res.render(`../views/universalapplicationform.ejs?company=${company}&job=${job}&category=${category}`)
//     }
//     catch(error)
//     {
//         console.log(error)
//     }
// })
router.get("/signuphandle",(req,res)=>{
    res.render("signup.ejs",{message:""});
})
router.post("/applicationformsubmit", upload.single("resume"), applicationformsubmit);
router.post("/signup",signup)
router.post("/aboutpage",aboutpage)
router.post("/searchjob",protect,searchjob)
router.get("/jobs",protect,jobs)
router.get("/searchindexjob",searchindexjob)
router.get("/about",protect,about)
router.get("/logout",logout)
router.get("/signinhandle",signinhandle )


router.get("/userdata",userdata)
router.post("/sendotp",sendotp)

router.post("/verifyotp",verifyotp)
router.post("/confirmpassword",confirmpassword)
router.get("/applicationsearch",applicationsearch)
router.get("/viewapplications",protect,viewapplications)
router.get("/corejobsapi",corejobsapi)
// router.get("/governmentjobsapi",(async(req,res)=>{
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
router.get("/graphcompany",(req,res)=>{
    res.render("../views/companygraph.ejs")
})
router.get("/applicationdocument", async (req, res) => {
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
                    _id: { $toLower: '$companyname' }, // Convert companyname to lowercase
                    count: { $sum: 1 }
                }
            }
        ]);

        const labels = documents.map(doc => doc._id);
        const documentCounts = documents.map(doc => doc.count);

        res.json({ labels, documentCounts });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get("/catapp", protect,(req, res) => {

    res.render("../views/chat.ejs");
});

router.get("/softwarejobsapi",softwarejobsapi)
module.exports=router;