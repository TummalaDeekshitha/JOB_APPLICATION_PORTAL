
 const express=require("express");
 const multer=require("multer");
 const storage=multer.memoryStorage();
 const upload=multer({storage:storage});
const mongoose=require("mongoose");
 
 var router = express.Router();

// var Signupcoll=require("../model/signupcoll");
// var {jobschema,Corejob}=require("../model/jobschemacoll");
 var Applicationcollection=require("../model/appschemacoll");
const {protect}=require("../middleware/protect");
const {index,applicationformsubmit,signup,aboutpage,searchjob,jobs,searchindexjob,about,logout,signinhandle,userdata,sendotp,verifyotp,confirmpassword,viewapplications,corejobsapi,softwarejobsapi, applicationdocument}=require("../controllers/indexcontroller.js");
router.get('/',index)
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

router.get("/viewapplications",protect,viewapplications)
router.get("/corejobsapi",corejobsapi)
router.get("/graphcompany",(req,res)=>{
    res.render("../views/companygraph.ejs")
})
router.get("/applicationdocument", applicationdocument);

router.get("/catapp", protect,(req, res) => {

    res.render("../views/chat.ejs");
});

router.get("/softwarejobsapi",softwarejobsapi)
module.exports=router;