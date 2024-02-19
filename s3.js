const AWS = require("aws-sdk");
const fs = require("fs");
require('dotenv').config();

// Load environment variables
const region = process.env.REGION;
const accessKeyId = process.env.ACCESSKEY;
const secretAccessKey = process.env.SECRETACESSKEY;
const bucketName = process.env.BUCKETNAME;

// Set AWS configuration
AWS.config.update({
    region,
    accessKeyId,
    secretAccessKey
});

// Create S3 instance
const s3 = new AWS.S3();

// Function to upload a file to S3
function uploadfile(file) {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    };
    return s3.upload(uploadParams).promise();
}

// Function to get a readable stream for a file from S3
function getfilestream(fileKey) {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    };
    return s3.getObject(downloadParams).createReadStream();
}

module.exports = {
    uploadfile,
    getfilestream
};
