const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
 
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.status(403).send({ success: false, message: "Bad Request" });
  }

  try {
    const decoded = jwt.verify(token, "thisismyfirstnodejsexpressmongodbproject");
    // console.log(decoded);
    if (decoded?._id == null) {
      return res.status(403).send({ success: false, message: "Bad Request" });
    }
    // console.log(token); 
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

module.exports = { protect };