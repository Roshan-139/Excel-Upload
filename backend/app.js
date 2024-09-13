const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const excelRoutes = require('./routes/excelroutes');
const app = express();
const { Pool } = require('pg');

//const shipment=require('./migration/models/psql/shipmentpsql');
// Enable CORS
app.use(cors());
const pool = new Pool({
    user: 'roshan139',
    host: '127.0.0.1',
    database: 'mydatabase',
    password: 'roshan123456',
    port: 5432,
  });
// Middleware to handle multipart/form-data
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
});// Initialize multer for file uploads

// Use upload middleware in the route
app.use('/excelHandler', upload.single('file'), excelRoutes);

// Serve static files
app.get('/files/samplefile.xlsx', (req, res) => {
    const filePath = path.join(__dirname, 'files', 'samplefile.xlsx');
    res.download(filePath, 'sample-file.xlsx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).send('File download error.');
      }
    });
  });

  app.get('/database/postgres', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM public."Shipments"'); // Replace with your SQL query
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
