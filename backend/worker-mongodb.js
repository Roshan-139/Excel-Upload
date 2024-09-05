const Bull = require('bull');
const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const insertIntoMongoDB = require('./models/mongomodel'); // Ensure path is correct
require('dotenv').config();

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_S3_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
});
const bucketName = process.env.AWS_S3_BUCKET;

// Configure MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const mongoQueue = new Bull('mongoQueue');

// MongoDB Worker
mongoQueue.process(async (job) => {
    const { filename } = job.data;
    const params = { Bucket: bucketName, Key: filename };

    try {
        const s3Object = await s3.getObject(params).promise();
        console.log("S3 Object Data:", s3Object.Body.toString());
        const jsonData = JSON.parse(s3Object.Body.toString());
        console.log("Parsed JSON Data:", jsonData);

        if (!jsonData || jsonData.length === 0) {
            console.error('The fetched file is empty or could not be parsed as JSON.');
            return;
        }

        await insertIntoMongoDB(jsonData);

        console.log(`Data from ${filename} saved to MongoDB.`);
    } catch (error) {
        console.error('Error processing file for MongoDB:', error);
    }
});
