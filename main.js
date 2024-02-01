
// const express=require("express");
// const path=require("path");
// const app=express();

// app.set("view engine","hbs");
// app.set("views",path.join(__dirname,"views"));
// const mongoose=require("mongoose");
// const { error } = require("console");
// app.use(express.urlencoded({ extended: true }));
// const {makeconnectionuser,Signupcoll} =require("./mangoosefile");
// const {makeconnectionjobs,Corejob}=require("./mangooseFilejobdatabase");
// //app.use(express.static(path.join(__dirname,"public")));
// const con=async()=>{
//     try{
// await makeconnectionuser().then((value)=>{console.log("got connected to user")});

   
//     }
//     catch(error)
//     {
//         console.log(error);
//     }
// }

// con();


// console.log(path.join(__dirname,"public"));
// app.get("/",(req,res)=>
// { 
//     res.render("../views/index.hbs",{aboutus:"deekshitha"});
//        console.log("my fault");
// })

// app.get("/login",(req,res)=>{
//     res.send("hi");
// })
// app.post("/signin",async(req,res)=>{
//     const email2=req.body.email1;
//     const pass1=req.body.password1;
//     const result =await Signupcoll.countDocuments({email:email2})
//     if(result>0)
//     {
//     const result2=await Signupcoll.countDocuments({email:email2,pass:pass1});
//     if(result2>0)
//     {
//         res.render('../views/about.hbs');
//     }
//     else{
//         console.log(email2);
//         console.log(pass1);
//         console.log(result2);
//         console.log(result);
//         res.render('../views/signin.hbs',{message:"wrong password"});
//     } 
//     }
//     else{
//         console.log(email2);
//         console.log(result);
//         res.render('../views/signin.hbs',{message:"you don't have account"});
//     }
    
    
// })
// app.post("/signup",(req,res)=>{
//     console.log("this is post method");
//     const name1=req.body.username;
//     const email1=req.body.email;
//     const pass1=req.body.pass;
    
     
//     const insert=async()=>{
        
//         try{
//     let doc=new Signupcoll({name:name1,
//         email: email1,
//         pass:pass1})
//         const value=await Signupcoll.countDocuments({email:email1});
//         if(value>0)
//         {
//          console.log("account already exist");
        
//           res.render("../views/signin.hbs",{message:"you already have an account"});

//         }

//     else{
//         let namevalue = name1;
//         let flag = /^[a-zA-Z0-9]+$/.test(namevalue);
//         console.log(namevalue.length)
//         if (!flag) {
//             res.render("../views/signup.hbs",{message:"username should contain only alphanumerics"});

//         }
//         else{

//         console.log(`${value}`)
//     await Signupcoll.insertMany([doc]);
//        console.log("inserted)");
//        res.render("../views/about.hbs");
//         }
//     }}
//     catch(error){
//         console.log(error)
//     }
// }

//     insert();

    
// })
// app.get("/userdata",(async(req,res)=>{
//     console.log("hiiiiiiiiiii");
    
//     try{
//         let p = await Signupcoll.find();
//         console.log(p);
//         res.json(p);
//     }
//     catch(error)
//     {
//         console.log("error");
//     }
   
// }))
// app.get("/corejobsapi",(async(req,res)=>{
//     console.log("hiiiiiiiiiii");
//     await makeconnectionjobs().then((value)=>{console.log("got connected to corejobs")});
//     try{
//         let p = await Corejob.find({});
//         console.log(p);
//         res.json(p);
//     }
//     catch(error)
//     {
//         console.log("error");
//     }
   
// }))

      
// app.use(express.static(path.join(__dirname,"public")));
// const start=async()=>{
//     try{
//         app.listen(3000,()=>{
//             console.log("hurray u got connected");
//         })
//         //deekshithareddy2223
//         //gXkPedRi3ZJadM22
        
        
//     }
//     catch(error)
//     {
//         console.log(error)

//      }
//  }
//  start();


// const express=require("express");
// const path=require("path");
// const app=express();

// app.set("view engine","hbs");
// app.set("views",path.join(__dirname,"views"));
// const mongoose=require("mongoose");
// //const MongoClient=require("mongodb")
// const { error } = require("console");
// app.use(express.urlencoded({ extended: true }));
// //const client=new MongoClient("mongodb+srv://deekshithareddy2223:gXkPedRi3ZJadM22@mycluster.mkhf17a.mongodb.net/?retryWrites=true&w=majority")
// //app.use(express.static(path.join(__dirname,"public")));

// const db1 = mongoose.createConnection("mongodb+srv://deekshithareddy2223:gXkPedRi3ZJadM22@mycluster.mkhf17a.mongodb.net/mydb?retryWrites=true&w=majority");
// const db2 = mongoose.createConnection("mongodb+srv://deekshithareddy2223:gXkPedRi3ZJadM22@mycluster.mkhf17a.mongodb.net/jobs?retryWrites=true&w=majority");
// db1.on('error', console.error.bind(console, 'MongoDB connection error (Database 1):'));
// db1.once('open', () => {
//   console.log('Connected to Database 1');
// });

// db2.on('error', console.error.bind(console, 'MongoDB connection error (Database 2):'));
// db2.once('open', () => {
//   console.log('Connected to Database 2');
// });
// const userschema=new mongoose.Schema({name:{type:String,
//     required:true},
// email: {type:String,
//     required:true},
// pass:{type:String,
//       required:true}
// })

// const coreschema=new mongoose.Schema({
//     jobname:{type:String,
//         required:true},
// openings: {type:Number,
//         required:true},
// lastdate:{type:String,
//           required:true},})

// const Signupcoll = db1.model('Signupcoll', userschema);
// const Corejob = db2.model('Corejob', coreschema);

// console.log(path.join(__dirname,"public"));
// app.get("/",(req,res)=>
// { 
//     res.render("../views/index.hbs",{aboutus:"deekshitha"});
//        console.log("my fault");
// })

// app.get("/login",(req,res)=>{
//     res.send("hi");
// })
// app.post("/applicationformsubmit",async(req,res)=>{
//     console.log(req.body);
//     const jobnamevalue=req.body.jobname1;
//     console.log(jobnamevalue);
//     await Corejob.updateOne({jobname:jobnamevalue},{$inc:{openings:-1}});
//     console.log("decrement is done");
//     res.render("../views/corejobs.hbs");
// })
// app.post("/signin",async(req,res)=>{
//     const email2=req.body.email1;
//     const pass1=req.body.password1;
//     const result =await Signupcoll.countDocuments({email:email2})
//     if(result>0)
//     {
//     const result2=await Signupcoll.countDocuments({email:email2,pass:pass1});
//     if(result2>0)
//     {
//         res.render('../views/about.hbs');
//     }
//     else{
//         console.log(email2);
//         console.log(pass1);
//         console.log(result2);
//         console.log(result);
//         res.render('../views/signin.hbs',{message:"wrong password"});
//     } 
//     }
//     else{
//         console.log(email2);
//         console.log(result);
//         res.render('../views/signin.hbs',{message:"you don't have account"});
//     }
    
    
// })
// app.post("/signup",(req,res)=>{
//     console.log("this is post method");
//     const name1=req.body.username;
//     const email1=req.body.email;
//     const pass1=req.body.pass;
    
     
//     const insert=async()=>{
        
//         try{
//     let doc=new Signupcoll({name:name1,
//         email: email1,
//         pass:pass1})
//         const value=await Signupcoll.countDocuments({email:email1});
//         if(value>0)
//         {
//          console.log("account already exist");
        
//           res.render("../views/signin.hbs",{message:"you already have an account"});

//         }

//     else{
//         let namevalue = name1;
//         let flag = /^[a-zA-Z0-9]+$/.test(namevalue);
//         console.log(namevalue.length)
//         if (!flag) {
//             res.render("../views/signup.hbs",{message:"username should contain only alphanumerics"});

//         }
//         else{

//         console.log(`${value}`)
//     await Signupcoll.insertMany([doc]);
//        console.log("inserted)");
//        res.render("../views/about.hbs");
//         }
//     }}
//     catch(error){
//         console.log(error)
//     }
// }

//     insert();

    
// })
// app.get("/userdata",(async(req,res)=>{
//     console.log("hiiiiiiiiiii");
    
//     try{
//         let p = await Signupcoll.find();
//         console.log(p);
//         res.json(p);
//     }
//     catch(error)
//     {
//         console.log("error");
//     }
   
// }))
// app.get("/corejobsapi",(async(req,res)=>{
//     console.log("hiiiiiiiiiii");
    
//     try{
//         let p = await Corejob.find({});
//         console.log(p);
//         res.json(p);
//     }
//     catch(error)
//     {
//         console.log("error");
//     }
   
// }))

      
// app.use(express.static(path.join(__dirname,"public")));
// const start=async()=>{
//     try{
//         app.listen(3000,()=>{
//             console.log("hurray u got connected");
//         })
//         //deekshithareddy2223
//         //gXkPedRi3ZJadM22
        
        
//     }
//     catch(error)
//     {
//         console.log(error)

//     }
// }
// start();


// }
// start();
const bcrypt = require('bcrypt');
const express=require("express");
const path=require("path");
const app=express();
const multer=require("multer");
const nodemailer=require("nodemailer")
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const mongoose=require("mongoose");
const { error } = require("console");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,"public")));
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
app.use(cookieParser())
const {makeconnectionuser,Signupcoll,Corejob,jobschema}=require("./mangoosefile")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
     return cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      return cb(null,`${Date.now()}-${file.originalname}`)
    }
  })
  makeconnectionuser();
  
console.log(path.join(__dirname,"public"));
app.get("/",(req,res)=>
{ 
    if(req.cookies.jwt){
    const verify=jwt.verify(req.cookies.jwt,"thisismyfirstnodejsexpressmongodbproject")
console.log("this is verification"+verify);
console.log("homeeeeeeeee")
res.render("./views/about.ejs")}
else{
    console.log("indexpage loading")

    res.render("./views/index.ejs")
}
       
})


const upload=multer({storage})
app.post("/applicationformsubmit",upload.single("resume"),async(req,res)=>{
    console.log(req.body);
    console.log(req.file);
    const jobnamevalue=req.body.jobname1;
    console.log(jobnamevalue);
    await Corejob.updateOne({jobname:jobnamevalue},{$inc:{openings:-1}});
    const transporter=nodemailer.createTransport({
        service: 'gmail',
  auth: {
    user: '20311a1206@sreenidhi.edu.in',
    pass: '20311A1206',
  },
    })
    const mailOptions = {
        from: '20311a1206@sreenidhi.edu.in',
        to: 'deekshithareddy2223@gmail.com',
        subject: 'JobForger',
        text: `your application for Job Name: ${jobnamevalue}\n got submitted`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
      
    console.log("decrement is done");
    res.render("../views/about.ejs",);
})
app.post("/signin",async(req,res)=>{
    
    
    const email2=req.body.email1;
    const pass1=req.body.password1;
    const result =await Signupcoll.findOne({email:email2})
    const result1=await Signupcoll.countDocuments({email:email2})
    //const resultn=await db1.find({});
    try{
    if(result1)
    {  
    const result2 = await bcrypt.compare(pass1, result.pass);
    const token=await result.generateAuthToken();
    
    if(result2>0)
    {
        res.cookie("jwt",token,{
            maxAge:100000,
            httpOnly:true
        });
        res.render('../views/about.ejs',{user:result.username});
    }
    else{
        console.log(email2);
        console.log(pass1);
        console.log(result2);
        console.log(result1);
        res.render('../views/signin.ejs',{message:"wrong password"});
    } 
    }
    else{
        //console.log(resultn);
        console.log(email2);
        console.log(result1);
        res.render('../views/signin.ejs',{message:"you don't have account"});
    }}
    catch (error) {
        console.error('Error comparing passwords:', error);
      }
    
    
})
app.post("/searchjob",async(req,res)=>
{
    console.log(req.body.category);
    console.log(req.body.role);
    const Collectionjob=mongoose.model(req.body.category,jobschema);
    //const collectionjob=client.db("jobs").collection(req.body.category);
    const doc=await Collectionjob.find({jobname:req.body.role});
    console.log(doc);
    res.render("../views/searchresult.ejs",{ category: req.body.category, role: req.body.role, documents: doc })
})
app.get("/about",async(req,res)=>{
try{
    if(req.cookies.jwt)
    {
        const verify=jwt.verify(req.cookies.jwt,"thisismyfirstnodejsexpressmongodbproject")
console.log("this is verification"+verify);
console.log("this is about block");
console.log(verify.username)
res.render("../views/about.ejs",{user:verify.username});}
else{
    console.log("hii");
    res.render("../views/signin.ejs",{message:"signin or singup first"});
    }}
catch(error)
{
    console.log(error)
}

    
 } )
 app.get("/logout",async(req,res)=>{
    res.clearCookie('jwt'); 
    res.redirect('/signinhandle'); 
 })
 app.get("/signinhandle",async(req,res)=>{
    
    try{
        if(req.cookies.jwt)
        {
            const verify=jwt.verify(req.cookies.jwt,"thisismyfirstnodejsexpressmongodbproject")
    console.log("this is verification"+verify);
    console.log("this is about block");
    console.log(verify.user);
    res.render("../views/about.ejs",{user:verify.username})}
    else{
        console.log("hii");
        res.render("../views/signin.ejs",{message:"signin or singup first"});
        }}
    catch(error)
    {
        console.log(error)
    }
    
        
     } )

app.post("/signup",(req,res)=>{
    console.log("this is post method");
    const name1=req.body.username;
    const email1=req.body.email;
    const pass1=req.body.pass;
    
     
    const insert=async()=>{
        
        try{
    
        const value=await Signupcoll.countDocuments({email:email1});
        if(value>0)
        {
         console.log("account already exist");
        
          res.render("../views/signin.ejs",{message:"you already have an account"});

        }

    else{
        let namevalue = name1;
        let flag = /^[a-zA-Z0-9]+$/.test(namevalue);
        console.log(namevalue.length)
        if (!flag) {
            res.render("../views/signup.ejs",{message:"username should contain only alphanumerics"});

        }
        else{
            let doc=new Signupcoll({name:name1,
                email: email1,
                pass:pass1});
                const token=doc.generateAuthToken();
                console.log(token);
                res.cookie("jwt",token,{
                    maxAge:100000,
                    httpOnly:true
                    
                })
      // await doc.save();
       
       res.render("../views/about.ejs",{user:name1});
        }
    }}
    catch(error){
        console.log(error)
    }
}

    insert();

    
})
app.get("/userdata",(async(req,res)=>{
    console.log("hiiiiiiiiiii");
    
    try{
        let p = await Signupcoll.find();
        console.log(p);
        res.json(p);
    }
    catch(error)
    {
        console.log("error");
    }
   
}))
app.get("/corejobsapi",(async(req,res)=>{
    console.log("hiiiiiiiiiii");
    
    try{
        let p = await Corejob.find();
        console.log(p);
        res.json(p);
    }
    catch(error)
    {
        console.log(error);
    }
   
}))

      
//app.use(express.static(path.join(__dirname,"public")));
const start=async()=>{
    try{
        app.listen(5000,()=>{
            console.log("hurray u got connected");
        })
        //deekshithareddy2223
        //gXkPedRi3ZJadM22
        
        
    }
    catch(error)
    {
        console.log(error)

    }
}
start();



