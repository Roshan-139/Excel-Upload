const Joi = require('joi');

// List of expected headers
const expectedHeaders = [
  'Shipment Type*',
  'Order Number*',
  'Order Type (STO/PO/SO/RO)*',
  'Primary Mode*',
  'Expected Delivery Date*',
  'Incoterm*',
  'Source Refrence ID*',
  'Destination Refrence ID*',
  'Cargo Type*',
  'Material Code*',
  'Quantity*',
  'Quantity Unit*',
  'Shipment Number'
];

// Function to validate headers against expected headers
const validateHeaders = function validateHeaders(headers) {
  // Clean and convert headers to lowercase
  const lowerCaseHeaders = headers.map(header => header.toLowerCase());
  
    // now check all the headers present match with our expected headers or not 
    const lowerCaseExpectedHeaders = expectedHeaders.map(header => header.toLowerCase());
  console.log(lowerCaseHeaders);
  console.log(lowerCaseExpectedHeaders);
    // Check if all expected headers are present
    const missingHeaders = lowerCaseExpectedHeaders.filter(header => !lowerCaseHeaders.includes(header));
  
    // if missingHeaders have length > 0 then it should return false and return the headers which are missing 
    return missingHeaders.length > 0 ? missingHeaders : null;
};

// Function to clean up header keys in data objects
const cleanKeys = function cleanKeys(obj) {
  const cleanedObj = {};
  for (let key in obj) {
    // Remove '*', spaces, and words in parentheses using regex
    const cleanedKey = key.replace(/[*\s]+|\([^)]*\)/g, '');
    cleanedObj[cleanedKey] = obj[key];
  }
  return cleanedObj;
}

const joivalidation = Joi.object({
  shipmentType: Joi.string().required(),
  orderNumber: Joi.string().required(),
  orderType: Joi.string().valid('STO', 'PO', 'SO', 'RO').required(),
  primaryMode: Joi.string().required(),
  expectedDeliveryDate: Joi.date().iso().required(),
  incoterm: Joi.string().required(),
  sourceRefrenceId: Joi.string().required(),
  destinationRefrenceId: Joi.string().required(),
  cargoType: Joi.string().required(),
  materialCode: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  quantityUnit: Joi.string().required(), // Assuming units might be string
  shipmentNumber: Joi.string().optional()
});

// Exporting the constants and functions
module.exports = { 
  joivalidation, 
  validateHeaders, 
  cleanKeys 
};
