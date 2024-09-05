// models/schemas/File.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileSchema = new Schema({
  id: { type: Number,autoincrement:true, required: true },
  po_number: { type: Number, required: true },
  container_no: { type: Number, required: true },
  hscode: { type: String, required: true },
  material_code: { type: String, required: true },
  material_name: { type: String, required: true },
  quantity: { type: Number, required: true },
  quantity_unit: { type: Number, required: true },
  net_weight: { type: Number, required: true },
  gross_weight: { type: Number, required: true },
  weight_unit: { type: Number, required: true },
  volume: { type: Number, required: true },
  volume_unit: { type: Number, required: true },
  invoice_number: { type: Number, required: true },
  pallet_no: { type: Number, required: true },
  //  created_at: { type: Date, required: true },
  //  updated_at: { type: Date, required: true }
});
const File = mongoose.model('File', fileSchema);
module.exports = File;
