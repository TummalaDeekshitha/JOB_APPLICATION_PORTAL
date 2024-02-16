const  S3  = require("aws-sdk/clients/s3");
const fs=require("fs")
require('dotenv').config();
const  region=process.env.REGION
const accesskey=process.env.ACCESSKEY
const secretaccesskey=process.env.SECRETACESSKEY
const bucketname=process.env.BUCKETNAME
const s3=new S3({
    region,
    accesskey,
    secretaccesskey
})
function uploadfile(file)
{
    const filestream=fs.createReadStream(file.path);
    const uploadparams={
        Bucket:bucketname,
        Body:filestream,
        Key:file.filename
    }
    return s3.upload(uploadparams).promise()
}
exports.uploadfile=uploadfile

function getfilestream(filekey)
{
    
    const downloadparams={
        Key:filekey,
        Bucket:bucketname
    }
    return s3.getObject(downloadparams).createReadStream()
}
exports.getfilestream=getfilestream;
