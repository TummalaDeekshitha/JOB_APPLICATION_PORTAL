const mongoose=require("mongoose")
const bcrypt = require('bcrypt');
const jwt =require("jsonwebtoken")
const makeconnectionuser=async()=>
{  try{
   const db1= await mongoose.connect("mongodb+srv://deekshithareddy2223:gXkPedRi3ZJadM22@mycluster.mkhf17a.mongodb.net/mydb?retryWrites=true&w=majority");
   
}catch(error)
{
console.log(error);
}


}

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
                const token=jwt.sign({_id:this._id,username:this.name},"thisismyfirstnodejsexpressmongodbproject");
                this.tokens=this.tokens.concat({token})
                console.log(token);
                await this.save();
                return token;

        }catch(error)
{
       
        console.log("the error "+error);
}

  }
  const Signupcoll=mongoose.model("signupcolls",signupschema);
  
  
  const jobschema=new mongoose.Schema({
        jobname:{type:String,
            required:true},
    openings: {type:Number,
            required:true},
    lastdate:{type:String,
              required:true},
    
      })
      
      const Corejob=mongoose.model("corejobs",jobschema);
      
    
//let doc1=new Signup({name:"deekshitha",
//email: "deekshithareddy2223@gmail.com",
//pass:"hibro"
//const res=await Signup.deleteMany({name:"deekshitha"});
//const result =await Signup.insertMany([doc1]);



module.exports={makeconnectionuser,Signupcoll,Corejob,jobschema};