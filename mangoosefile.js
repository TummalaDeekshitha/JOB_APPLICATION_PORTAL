
const mongoose= require('mongoose');
require('dotenv').config();
const  username=process.env.USERNAME
 const password=process.env.PASSWORD
 console.log(password);
 console.log(username);
const connectDB = async() => {
    
    const url = `mongodb+srv://deekshithareddy2223:gXkPedRi3ZJadM22@mycluster.mkhf17a.mongodb.net/mydb?retryWrites=true&w=majority`
 
    await mongoose.connect(url)

        .then(() => {
            console.log(password);
    console.log(username);
            console.log(`Connected to DB: ${url}`);
        })
        .catch((err) => {
            console.error(`Error connecting to DB: ${err.message}`);
            process.exit(1);
        });
 
    const dbConnection = mongoose.connection;
 
    await dbConnection.on("error", (err) => {
        console.error(`Error connecting to DB: ${err}`);
    });
 
    dbConnection.once("open", () => {
        console.log(`Connected to DB: ${url}`);
    });
};
module.exports = connectDB;
//connectDB();


// const signupschema=new mongoose.Schema({name:{type:String,
//         required:true},
// email: {type:String,
//         required:true},
// pass:{type:String,
//           required:true},
// tokens:[{token:{type:String, required:true}}]
//   })
//   signupschema.pre("save",async function(next){
//         if(this.isModified("pass")){
//                 console.log(`the current password is ${this.pass}`)
//                 this.pass=await bcrypt.hash(this.pass,10);
//                 console.log(`tje current password is ${this.pass}`);
                
//         }
//         next();
//   })

//   signupschema.methods.generateAuthToken=async function(){
//         try{
//                 const token=jwt.sign({_id:this._id,username:this.name},"thisismyfirstnodejsexpressmongodbproject");
//                 this.tokens=this.tokens.concat({token})
//                 console.log(token);
//                 await this.save();
//                 return token;

//         }catch(error)
// {
       
//         console.log("the error "+error);
// }

//   }
//   var Signupcoll=mongoose.model("signupcolls",signupschema);
  
  
//   const jobschema=new mongoose.Schema({
//         companyname:{type:String,required:true
//         },
//         jobname:{type:String,
//             required:true},

//     openings: {type:Number,
//             required:true},
//     lastdate:{type:String,
//               required:true},
//      description:{
//         type:String,
//         required:true
//      },
//      logo:{
//         data:Buffer,
//         contentType:String

//     }
    
//       })
      
//       var  Corejob=mongoose.model("corejobs",jobschema);
// const employerschema=new mongoose.Schema({
//         name:{type:String,
//         required:true},
//         companyname:{type:String,
//         required:true},
//         email:{type:String,
//         required:true},
//         pass:{type:String,
//         required:true},
//         industry:{type:String,
//                 required:true},
//         employeridnumber:{type:String,
//                required:true},
//         aadharnumber:{type:Number,
//                 required:true},
//          tokens:[{token:{type:String,required:true}}]
// }  )   
// employerschema.pre("save",async function(next){
//         if(this.isModified("pass")){
//                 console.log(`the current password is ${this.pass}`)
//                 this.pass=await bcrypt.hash(this.pass,10);
//                 console.log(`tje current password is ${this.pass}`);
                
//         }
//         next();})
// employerschema.methods.generateAuthToken=async function(){
//         try{
//                 const token=jwt.sign({_id:this._id,name:this.name,email:this.email,employeridnumber:this.employeridnumber},"thisismyfirstnodejsexpressmongodbproject");
//                 this.tokens=this.tokens.concat({token})
//                 console.log(token);
//                 await this.save();
//                 return token;

//         }catch(error)
// {
       
//         console.log("the error "+error);
// }}
// const appschema =new mongoose.Schema({
//         name:{type:String,required:true},
//         email:{type:String,required:true},
//         companyname:{type:String,required:true},
//         jobname:{type:String,required:true},
//         phoneno:{type:String,required:true},
//         category:{type:String,required:true},
//         coverletter:{type:String,required:true},
//         resume:{
//             data:Buffer,
//             contentType:String,
//         }
        

//     })
// const Applicationcollection=mongoose.model("applicationdata",appschema);

//const Employerdetail=mongoose.model("employerdetails",employerschema);
    
// const imageschema=new mongoose.Schema({
//         imagename:{type:string,
//                     required:true},
//         image:{
//                 data:Buffer,
//                 contentType:String,
//         }

        
// })
//const Imagemodel=mongoose.model("staticimages",imageschema)
//let doc1=new Signup({name:"deekshitha",
//email: "deekshithareddy2223@gmail.com",
//pass:"hibro"
//const res=await Signup.deleteMany({name:"deekshitha"});
//const result =await Signup.insertMany([doc1]);
