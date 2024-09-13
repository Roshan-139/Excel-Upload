const AWS = require('aws-sdk');
const uuid = require('uuid');
require('dotenv').config();

// Configure the AWS SDK
const s3 = new AWS.S3({
  endpoint: process.env.AWS_S3_ENDPOINT,
  s3ForcePathStyle: true,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4'
});

const bucketName = process.env.AWS_S3_BUCKET;

class AWSS3Wrapper {
  constructor(data) {
    this.stringData = data;
    this.key = uuid.v4(); // Generate a unique key for the object
    console.log(`Initialized AWSS3Wrapper with key: ${this.key}`); // Debugging
  }

  async createBucket() {
    try {
      await s3.createBucket({ Bucket: bucketName }).promise();
      console.log('Bucket created');
    } catch (err) {
      console.log(err);
    }
  }

  async checkIfObjectExists() {
    try {
      await s3.headObject({
        Bucket: bucketName,
        Key: this.key // Ensure this.key is used here
      }).promise();
      return true; // Object exists
    } catch (err) {
      if (err.code === 'NotFound') {
        return false; // Object does not exist
      }
      throw err; // Other errors
    }
  }

  async putObject() {
    try {
      const exists = await this.checkIfObjectExists();
      if (exists) {
        console.log(`Object with key ${this.key} already exists. Skipping upload.`);
        return this.key; // Return the existing key
      }
      await s3.putObject({
        Bucket: bucketName,
        Key: this.key, // Ensure this.key is used here
        Body: this.stringData,
      }).promise();
      console.log('Object stored in S3 successfully', this.key);
      return this.key; // Return the key
    } catch (err) {
      console.log('Fail to push object in S3', err);
      throw new Error('Error in putting object');
    }
  }

  async getObject(key) {
    try {
      const data = await s3.getObject({
        Bucket: bucketName,
        Key: key, // Ensure the provided key is used here
      }).promise();
      return data;
    } catch (err) {
      console.log('Error fetching object:', err);
      throw new Error('Error in fetching object');
    }
  }

  async deleteObject() {
    try {
      await s3.deleteObject({
        Bucket: bucketName,
        Key: this.key, // Ensure this.key is used here
      }).promise();
      console.log(`Object '${this.key}' deleted successfully.`);
    } catch (err) {
      console.log('Error deleting object:', err);
      throw new Error('Error in deleting the object');
    }
  }

  async listObjects(params) {
    try {
      const data = await s3.listObjects(params).promise();
      return data;
    } catch (err) {
      console.error('Error listing objects from S3:', err);
      throw new Error('Error in listing objects');
    }
  }
}

module.exports = AWSS3Wrapper;
