const Worker = require('bull');
const AWSS3Wrapper = require('./config/s3config');
const Excel = require('./utils/readexcel');
const awsS3 = new AWSS3Wrapper();
const sequelize = require('./config/connectdb');
const insertmongoodb = require('./insertion/mongoinsertion');
const insertpsql=require('./insertion/psqlinsertion');
//const StoreData = require('./utils/storeData');
// connecting to that queue so that it can processed ...
const queue = new Worker('myQueue', {
	redis: {
		host: 'localhost',
		port: 6379,
	},
});

const processJob = async (job) => {
    // Start processing the job
    console.log('Inside job function worker--------------->');

    // Fetch object from S3
    const obj = await awsS3.getObject(job.data.filekey);
    const objectBuffer = obj.Body;
    const convertedData = objectBuffer.toString('utf-8');
    const jsonConversion = JSON.parse(convertedData);

    // Initialize Excel utility and clean data
    const excel = new Excel();
    const cleanedData = excel.cleanData(jsonConversion);

    // Initialize locationMaster with a Set to track unique IDs
    await insertmongoodb(cleanedData);
    console.log('Data Inserted into mongodb');
    await insertpsql(cleanedData);
    console.log('Data Inserted into psql');

};
async function connectPsql() {
	try {
		await sequelize.authenticate();
		console.log('connected to postgres');
	} catch (error) {
		console.error('Unbale to connect db');
	}
}

connectPsql();
queue.process(async (job) => {
	//console.log(job.data);
	await processJob(job);
});

queue.on('completed', (job) => {
	console.log(`job has completed!`);
});

queue.on('failed', (job, err) => {
	console.log('-----', err);
	console.log(` it has failed  `);
});

console.log('worker started');

module.exports = processJob;
// take the connection with mongo db over here
