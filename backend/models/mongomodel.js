// mongodbInsert.js
const mongoose = require('mongoose');
const File = require('./schemas/mongoFile'); // Your Mongoose model

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
async function insertIntoMongoDB(data) {
  try {
    await File.insertMany(data.map(row => ({
      id: row.id,
      po_number: row.po_number,
      container_no: row.container_no,
      hscode: row.hscode,
      material_code: row.material_code,
      material_name: row.material_name,
      quantity: row.quantity,
      quantity_unit: row.quantity_unit,
      net_weight: row.net_weight,
      gross_weight: row.gross_weight,
      weight_unit: row.weight_unit,
      volume: row.volume,
      volume_unit: row.volume_unit,
      invoice_number: row.invoice_number,
      pallet_no: row.pallet_no,
        // created_at: new Date(row.created_at),
        // updated_at: new Date(row.updated_at)
    })));
    console.log('Data inserted into MongoDB successfully');
  } catch (error) {
    console.error('Error inserting data into MongoDB:', error);
  }
}
module.exports = insertIntoMongoDB;