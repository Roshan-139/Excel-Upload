const { DataTypes } = require('sequelize');
const sequelize = require('../../../config/connectdb');
const Cities = require('./citypsql'); // Ensure this path is correct
const Shipments = sequelize.define('Shipments', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    shipmentType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    orderType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sourceReferenceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cities,
            key: 'id'
        }
    },
    destinationReferenceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Cities,
            key: 'id'
        }
    },
    primaryMode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expectedDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    incoterm: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cargoType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    materialCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantityUnit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shipmentNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    // Additional model options can go here
});

module.exports = Shipments;
