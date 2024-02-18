const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const adminprotect = asyncHandler(async (req, res, next) => {
 
  const token = req.cookies.adminjwt;
  
  if (!token) {
    return res.render("../views/adminlogin.ejs");
  }

  try {
    const decoded = jwt.verify(token, "thisismyfirstnodejsexpressmongodbproject");
   
    if (decoded?._id == null) {
      return res.render("../views/adminlogin.ejs");;
    }
   
    console.log(decoded.name);
    req.myusername = await decoded.name;
    req.myemail=await decoded.email
     console.log(req.myusername);
     console.log(req.myemail);
    next();
  } catch (err) {
    console.log("Error in protect middleware:");
    return res
      .status(500)
      .send({ success: false, message: "Internal Server Error" });
  }
 
});

module.exports = { adminprotect };