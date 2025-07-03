'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Trip.belongsTo(models.Route, { 
        foreignKey: 'routeId', as: 'route' });
      Trip.hasMany(models.Payment, { foreignKey: 'tripId', as: 'payments' });
    }
  }

  Trip.init({
    origin: DataTypes.STRING,
    destination: DataTypes.STRING,
    fare: DataTypes.FLOAT,
    date: DataTypes.DATE,
    time: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Trip',
  });

  return Trip;
};
