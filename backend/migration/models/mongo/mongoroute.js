const express = require('express');
const router = express.Router();
const Product = require('./productmongo');
const Location = require('./locationmongo');

router.post('/create-product', async (req, res) => {
  const {
    ShipmentType,
    OrderNumber,
    OrderType,
    PrimaryMode,
    ExpectedDeliveryDate,
    Incoterm,
    SourceRefrenceID,
    DestinationRefrenceID,
    CargoType,
    MaterialCode,
    Quantity,
    QuantityUnit,
    ShipmentNumber
  } = req.body;

  try {
    const product = new Product({
      ShipmentType,
      OrderNumber,
      OrderType,
      PrimaryMode,
      ExpectedDeliveryDate,
      Incoterm,
      SourceRefrenceID,
      DestinationRefrenceID,
      CargoType,
      MaterialCode,
      Quantity,
      QuantityUnit,
      ShipmentNumber
    });

    await product.save();
    res.status(201).send('Product created successfully');
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send('Error creating product');
  }
});

module.exports = router;
