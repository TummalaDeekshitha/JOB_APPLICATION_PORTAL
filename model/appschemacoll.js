const mongoose=require("mongoose");

const appschema =new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    companyname:{type:String,required:true},
    jobname:{type:String,required:true},
    phoneno:{type:String,required:true},
    category:{type:String,required:true},
    coverletter:{type:String,required:true},
    resume:{
        data:Buffer,
        contentType:String,
    },
    applieddate:{
        type: Date,
        default: Date.now,
        required: true,
    },
    status:{
     type:String
    }

})

const Applicationcollection=mongoose.model("applicationdata",appschema);
module.exports=Applicationcollection;