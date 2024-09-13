const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/connectdb.js');
const Shipment = require('./shipmentpsql');

const Cities = sequelize.define('Cities', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	referenceId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
},
{
    tableName: 'Cities',
    timestamps: false
});

// Define a one-to-many relationship from Cities to Shipments for sourceReferenceId
Cities.hasMany(Shipment, { foreignKey: 'sourceReferenceId' });

// Define a one-to-many relationship from Cities to Shipments for destinationReferenceId
Cities.hasMany(Shipment, { foreignKey: 'destinationReferenceId' });

module.exports = Cities;
