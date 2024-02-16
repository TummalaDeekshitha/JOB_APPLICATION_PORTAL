
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signupschema=new mongoose.Schema({name:{type:String,
    required:true},
email: {type:String,
    required:true},
pass:{type:String,
      required:true},
tokens:[{token:{type:String, required:true}}]
})
signupschema.pre("save",async function(next){
    if(this.isModified("pass")){
            console.log(`the current password is ${this.pass}`)
            this.pass=await bcrypt.hash(this.pass,10);
            console.log(`tje current password is ${this.pass}`);
            
    }
    next();
})

signupschema.methods.generateAuthToken=async function(){
    try{
            const token=jwt.sign({_id:this._id,email:this.email,name:this.name},"thisismyfirstnodejsexpressmongodbproject");
            this.tokens=this.tokens.concat({token})
            console.log(token);
            await this.save();
            return token;

    }catch(error)
{
   
    console.log("the error "+error);
}

}
var Signupcoll=mongoose.model("signupcolls",signupschema);
module.exports=Signupcoll;