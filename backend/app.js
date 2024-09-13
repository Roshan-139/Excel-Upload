const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const excelRoutes = require('./routes/excelroutes');
const app = express();

// Enable CORS
app.use(cors());

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


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
