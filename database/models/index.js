'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

import component from './component';
import device from './device';
import devicescategory from './devicescategory';
import order from './order';
import orderdetails from './orderdetails';
import servicescategory from './servicescategory';
import state from './state';
import user from './user';


db.Component = component(sequelize, Sequelize.DataTypes);
db.Device = device(sequelize, Sequelize.DataTypes);
db.Devicescategory = devicescategory(sequelize, Sequelize.DataTypes);
db.Order = order(sequelize, Sequelize.DataTypes);
db.Orderdetails = orderdetails(sequelize, Sequelize.DataTypes);
db.Servicescategory = servicescategory(sequelize, Sequelize.DataTypes);
db.State = state(sequelize, Sequelize.DataTypes);
db.User = user(sequelize, Sequelize.DataTypes);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
