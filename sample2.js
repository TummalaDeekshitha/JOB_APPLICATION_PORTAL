const {makeconnection,schema} =require("./mangoosefile");
const mongoose=reqire("mongoose");
const con=async()=>{
    try{
await makeconnection();
    }
    catch(error)
    {
        console.log(error);
    }
}
con();
const Signupcoll=new mongoose.model("Signupcoll",schema);
module.exports=Signupcoll;