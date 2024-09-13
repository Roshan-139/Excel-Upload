const mongoose = require('mongoose') ; 
const { INTEGER } = require('sequelize');
const locationSchema = new mongoose.Schema({
    locationName : {type : String , required: true}
});

const Location = mongoose.model('Location' , locationSchema);
module.exports = Location ; 