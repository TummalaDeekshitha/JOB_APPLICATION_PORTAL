
 const express=require("express");
const multer=require("multer");
const upload=multer({dest:"uploads/"});
var router = express.Router();
const {registeremployer, resendotp,verifyotp}=require("../controllers/employerregistercontroller.js")

router.get("/doemployerregistration",(req,res)=>{
    res.render("employerregister.ejs",{message:""});
})

router.post("/registeremployer",upload.single("photo"), registeremployer)
router.get("/resendotp",resendotp)
router.post("/verifyotp",verifyotp)
module.exports=router