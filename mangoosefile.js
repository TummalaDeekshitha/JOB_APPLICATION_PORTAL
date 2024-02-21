
const mongoose= require('mongoose');
require('dotenv').config();
const  username=process.env.USERNAME
 const password=process.env.PASSWORD
 console.log(password);
 console.log(username);
const connectDB = async() => {
    
    const url = process.env.URL;
 
    await mongoose.connect(url)

        .then(() => {
            console.log(password);
    console.log(username);
            console.log(`Connected to DB `);
        })
        .catch((err) => {
            console.error(`Error connecting to DB: ${err.message}`);
            process.exit(1);
        });
 
    // const dbConnection = mongoose.connection;
 
    // await dbConnection.on("error", (err) => {
    //     console.error(`Error connecting to DB: ${err}`);
    // });
 
    // dbConnection.once("open", () => {
    //     console.log(`Connected to DB: ${url}`);
    // });
};
module.exports = { connectDB };

