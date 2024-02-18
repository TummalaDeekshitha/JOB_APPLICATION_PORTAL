const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const employerprotect = asyncHandler(async (req, res, next) => {
 
  const token = req.cookies.employerjwt;
  
  if (!token) {
    res.render("../views/employerlogin.ejs",{message:""});
  }

  try {
    const decoded = jwt.verify(token, "thisismyfirstnodejsexpressmongodbproject");
    
    if (decoded?._id == null) {
       res.render("../views/employerlogin.ejs",{message:""});;
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

module.exports = { employerprotect };