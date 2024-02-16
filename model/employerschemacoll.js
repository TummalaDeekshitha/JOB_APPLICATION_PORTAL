const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const employerschema=new mongoose.Schema({
    name:{type:String,
    required:true},
    companyname:{type:String,
    required:true},
    email:{type:String,
    required:true},
    pass:{type:String,
    required:true},
    industry:{type:String,
            required:true},
    employeridnumber:{type:String,
           required:true},
    aadharnumber:{type:Number,
            required:true},
    admin:{
        type: Boolean,
        default: false ,
        required:true

    },
    photo:{
        type:String,
        default:"/profile.jpg"
    },
    eligible:{
        type: Boolean,
        default: false ,
        required:true

    },
     tokens:[{token:{type:String,required:true}}]
}  )   
employerschema.pre("save",async function(next){
    if(this.isModified("pass")){
            console.log(`the current password is ${this.pass}`)
            this.pass=await bcrypt.hash(this.pass,10);
            console.log(`the current password is ${this.pass}`);
            
    }
    next();})
employerschema.methods.generateAuthToken=async function(){
    try{
            const token=jwt.sign({_id:this._id,name:this.name,email:this.email},"thisismyfirstnodejsexpressmongodbproject");
            this.tokens=this.tokens.concat({token})
            console.log(token);
            await this.save();
            return token;

    }catch(error)
{
   
    console.log("the error "+error);
}}
const Employerdetail=mongoose.model("employerdetails",employerschema);
module.exports=Employerdetail;