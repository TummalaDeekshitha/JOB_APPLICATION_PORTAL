// Import the functions you need from the SDKs you need
const { initializeApp } =require( "firebase/app");
const { getMessaging } =require( "firebase/messaging");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuwDblj6Dua8DB7auVMglbh2lieqFhCGo",
  authDomain: "jobapplicationportal-8ad50.firebaseapp.com",
  projectId: "jobapplicationportal-8ad50",
  storageBucket: "jobapplicationportal-8ad50.appspot.com",
  messagingSenderId: "741691085051",
  appId: "1:741691085051:web:46aa54e579c918457a205e",
  measurementId: "G-JDDSD3WK58"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseapp);
 const generateToken=async()=>{
    const permission=await Notification.requestPermission();
    console.log(permission);
 }
module.exports={generateToken};