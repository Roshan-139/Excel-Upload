const Bull = require('bull');
const AWS = require('aws-sdk');
const { Client } = require('pg');
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

// Configure PostgreSQL Client
const client = new Client({
    connectionString: process.env.POSTGRES_URI
});
client.connect();

const postgresQueue = new Bull('postgresQueue');

// PostgreSQL Worker
postgresQueue.process(async (job) => {
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

        // Assuming your schema is compatible with the database
        for (const row of jsonData) {
            await client.query('INSERT INTO your_table(column1, column2) VALUES($1, $2)', [row.field1, row.field2]);
        }

        console.log(`Data from ${filename} saved to PostgreSQL.`);
    } catch (error) {
        console.error('Error processing file for PostgreSQL:', error);
    }
});
