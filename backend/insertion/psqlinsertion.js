const { Pool } = require('pg');
const Cities = require('../migration/models/psql/citypsql'); // Adjust the path to your Cities model
const Shipments = require('../migration/models/psql/shipmentpsql'); // Adjust the path to your Shipments model
const pgPool = new Pool({
  user: 'roshan139',
  host: 'localhost',
  database: 'mydatabase',
  password: 'roshan139',
  port: 5432,
});
async function insertpsql(data) {
  const client = await pgPool.connect();
  try {
    // Step 1: Start a transaction
    await client.query('BEGIN');
    console.log('-------------', data);
    // Step 2: Create a location master array with SourceReferenceID and DestinationReferenceID
    let locationMaster = [];
    data.forEach(row => {
      locationMaster.push(row.SourceRefrenceID, row.DestinationRefrenceID);
    });
    // Step 3: Remove duplicates
    locationMaster = [...new Set(locationMaster)];
    console.log('location master', locationMaster);
    // Step 4: Create a map to store the location IDs
    const locationMap = {};
    for (const locationName of locationMaster) {
      // Step 5: Find or create the location in Cities
      const [city] = await Cities.findOrCreate({
        where: { referenceId: locationName },
        defaults: { referenceId: locationName },
      });
      // Step 6: Map the location name to the city id
      locationMap[locationName] = city.id;
    }
    console.log('location map', locationMap);

    // Step 7: Prepare the shipment data for bulk insertion
    const shipmentData = data.map(row => ({
      shipmentType: row.ShipmentType,
      orderNumber: row.OrderNumber,
      orderType: row.OrderType,
      sourceReferenceId: locationMap[row.SourceRefrenceID], // Use the mapped city id
      destinationReferenceId: locationMap[row.DestinationRefrenceID], // Use the mapped city id
      primaryMode: row.PrimaryMode,
      expectedDeliveryDate: row.ExpectedDeliveryDate,
      incoterm: row.Incoterm,
      cargoType: row.CargoType,
      materialCode: row.MaterialCode,
      quantity: row.Quantity,
      quantityUnit: row.QuantityUnit,
      shipmentNumber: row.ShipmentNumber || null,
    }));
    // Step 8: Bulk insert into Shipments
    await Shipments.bulkCreate(shipmentData, { validate: true });
    // Step 9: Commit the transaction
    await client.query('COMMIT');
    console.log('Data inserted into PostgreSQL successfully');
  } catch (error) {
    // Step 10: Rollback the transaction if an error occurs
    await client.query('ROLLBACK');
    console.error('Error inserting data into PostgreSQL:', error);
    throw error;
  } finally {
    // Step 11: Release the client
    client.release();
  }
}
module.exports = insertpsql;