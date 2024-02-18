var mongoose=require("mongoose")
const jobschema=new mongoose.Schema({
    companyname:{type:String,required:true
    },
    jobname:{type:String,
        required:true},

totalapplications: {type:Number,
        required:true},
openings:{type:Number,
  required:true},
  lastdate: {
    type: Date, 
    required: true},
 description:{
    type:String,
    required:true
 },
 logo:{
    data:Buffer,
    contentType:String

},
employeremail:{
  type:String,
  required:true,

}

  })
  var  Softwarejob=mongoose.model("Softwarejobs",jobschema);
  var  Corejob=mongoose.model("corejobs",jobschema);
module.exports={jobschema,Corejob,Softwarejob};