const express = require('express');
const excelControllers = require('../controllers/excelcontrol');

class Excel {
  static getRoutes() {
    const router = express.Router();

    // Define the routes
    router.get('/', excelControllers.getUsers);
    router.get('/upload', excelControllers.getFile); // Adjusted endpoint to handle file retrieval if needed
    router.post('/upload', excelControllers.uploadFile); // Ensure this matches the expected endpoint

    return router;
  }
}
module.exports = Excel.getRoutes();
