const mongoose = require('mongoose');
const Location = require('./locationmongo');
const joivalidation = require('/home/roshan.priyadarshi/CLtask/backend/utils/valid.js');

const productSchema = new mongoose.Schema({
  ShipmentType: {
    type: String,
  },
  OrderNumber: {
    type: String,
  },
  OrderType: {
    type: String,
  },
  PrimaryMode: {
    type: String,
  },
  ExpectedDeliveryDate: {
    type: Date,
  },
  Incoterm: {
    type: String,
  },
  SourceRefrenceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  },
  DestinationRefrenceID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  },
  CargoType: {
    type: String,
  },
  MaterialCode: {
    type: String,
  },
  Quantity: {
    type: Number,
  },
  QuantityUnit: {
    type: String,
  },
  ShipmentNumber: {
    type: Number,
  },
  SourceLocationName: {
    type: String,
  },
  DestinationLocationName: {
    type: String,
  },
});

// Pre-save middleware to fetch and set location names
productSchema.pre('save', async function (next) {
  try {
    // Fetch location names based on references
    const sourceLocation = await Location.findById(this.SourceRefrenceID);
    const destinationLocation = await Location.findById(this.DestinationRefrenceID);
    console.log('=----------------', sourceLocation);
    console.log('-------------------', destinationLocation);
    if (sourceLocation) {
      this.SourceLocationName = sourceLocation.locationName;
    }
    if (destinationLocation) {
      this.DestinationLocationName = destinationLocation.locationName;
    }

    // Validate the product object with custom validation
    await joivalidation.validateAsync(this.toObject());
    console.log('object is ', this.toObject());
    next();
  } catch (error) {
    next(error);
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
