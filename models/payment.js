'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      // Payment belongs to Trip
      Payment.belongsTo(models.Trip, { foreignKey: 'tripId', as: 'trip' });
    }
  }

  Payment.init({
    tripId: DataTypes.INTEGER,
    amountPaid: DataTypes.FLOAT,
    paymentMethod: DataTypes.STRING,
    payerPhone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });

  return Payment;
};
