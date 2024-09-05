const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const AWS = require('aws-sdk');
const sequelize = require('./config/psqldatabase'); // PostgreSQL configuration
const insertMongoData = require('./models/mongomodel'); // MongoDB insertion logic
const insertPostgresData = require('./models/postmodel'); // PostgreSQL insertion logic
const fileSchema = require('./validation/valid'); // Joi validation schema
const Bull =require('bull')
const app = express();
const port = 3001;

// Configure CORS
app.use(cors());

// Configure AWS SDK
const s3 = new AWS.S3({
  endpoint: process.env.AWS_S3_ENDPOINT,
  s3ForcePathStyle: true,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
// const postgresQueue = new Bull('postgresQueue');
// const mongoQueue = new Bull('mongoQueue');
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Synchronize Sequelize models
sequelize.sync()
  .then(() => {
    console.log('PostgreSQL database & tables created!');
  })
  .catch(err => {
    console.error('Unable to connect to the PostgreSQL database:', err);
  });

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'file') {
      cb(null, true);
    } else {
      cb(new multer.MulterError('Unexpected field'), false);
    }
  }
});

// Route to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).send(req.fileValidationError);
  }
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  try {
    // Read and parse the Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(data);
    
    // Validate each row of data
    const validatedData = [];
    for (const row of data) {
      const { error } = fileSchema.validate(row);
      if (error) {
        console.error('Validation error:', error.details.map(detail => detail.message).join(', '));
        continue;
      }
      validatedData.push(row);
    }

    if (validatedData.length === 0) {
      return res.status(400).send('No valid data found to process.');
    }

    // Upload file to FakeS3
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: req.file.originalname,
      Body: req.file.buffer
    };

    await s3.upload(s3Params).promise();

    // Store validated data in MongoDB
    await insertMongoData(validatedData);

    // // Store validated data in PostgreSQL
    await insertPostgresData(validatedData);
    // await postgresQueue.add({ filename: `${req.file.originalname}.json`, data });
    // await mongoQueue.add({ filename: `${req.file.originalname}.json`, data });
    res.send(`File ${req.file.originalname} uploaded to FakeS3, data validated, and stored in MongoDB and PostgreSQL.`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing the file.');
  }
});

// Route to list files in S3 bucket
app.get('/files', async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET
    };

    const data = await s3.listObjects(params).promise();
    const files = data.Contents.map(file => ({
      key: file.Key,
      lastModified: file.LastModified,
      size: file.Size
    }));

    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving files from S3.');
  }
});

// Route to download sample file
app.get('/files/sample-file.xlsx', (req, res) => {
  const filePath = path.join(__dirname, 'xxccxx.xlsx'); // Adjust path as needed
  res.download(filePath, 'sample-file.xlsx', (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error downloading file. Please try again.');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
