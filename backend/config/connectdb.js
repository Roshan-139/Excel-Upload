const { Sequelize } = require('sequelize');
require('dotenv').config();
const mongoose = require('mongoose');
//postgresql connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      statement_timeout: 10000,
    },
    port: process.env.DB_PORT
  },
  console.log('Connected to postresql successfully')
);
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});


module.exports=sequelize;
