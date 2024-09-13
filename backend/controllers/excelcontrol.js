const AwsS3Wrapper = require('../config/s3config');
const Excel = require('../utils/readexcel');
const { initiate } = require('../config/bullmq');
const Product = require('../migration//models/mongo/productmongo');

const getUsers = (req, reply) => {
	reply.send('user');
};

const getFile = async (req, reply) => {
	try {
		const Products = await Product.find();
		if (Products.length === 0) {
			return reply.status(200).send({ message: 'nothing to show here' });
		}
		return reply.status(200).send({ file: Products });
	} catch (err) {
		console.log(err);
		reply.status(500).send({ error: 'failed to fetch object ' });
	}
};

const uploadFile = async (req, res) => {
    try {
      console.log('Received file upload request');
  
      if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
      }
  
      const fileBuffer = req.file.buffer;
  
      const excelHandler = new Excel(fileBuffer);
      const { jsonData, worksheet } = await excelHandler.readExcel();
      const stringData = JSON.stringify(jsonData);
  
      const uploadS3 = new AwsS3Wrapper(stringData);
      await uploadS3.createBucket();
      const uniqueKey = await uploadS3.putObject();
  
      // Add the job to the queue
      await initiate({ jobName: 'ExcelHandling', filekey: uniqueKey });
  
      console.log('Job added to queue with file key:', uniqueKey);
  
      return res.status(200).send({ message: 'File Processed' });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: 'Failed to process file' });
    }
  };
  
module.exports = { getUsers, getFile, uploadFile };