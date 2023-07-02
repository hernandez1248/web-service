"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Order.belongsTo(models.Servicescategory, {
        as: "servicescategory", //alias parala relacion
        foreignKey: "servicesId", //pf en products
      });

      models.Order.belongsTo(models.Device, {
        as: "device", //alias parala relacion
        foreignKey: "deviceId", //pf en products
      });

      models.Order.belongsTo(models.User, {
        as: "user", //alias parala relacion
        foreignKey: "userId", //pf en products
      });

      models.Order.hasMany(models.Orderdetails, {
        as: "orderdetails", //alias parala relacion
        foreignKey: "ordersId", //pf en products
      });

      models.Order.hasMany(models.State, {
        as: "state", //alias parala relacion
        foreignKey: "ordersId", //pf en products
      });
    }
  }
  Order.init(
    {
      date: {
        type: DataTypes.DATETIME,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      fullName: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El nombre es obligatorio",
          },
          is: {
            args: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
            msg: "El nombre debe contener solo letras, espacios y acentos",
          },
        },
      },
      phone: {
        type: DataTypes.STRING(16),
        allowNull: false,
        validate: {
          isNumeric: {
            msg: "El teléfono debe contener solo números",
          },
          is: {
            args: /^[0-9]{10}$/,
            msg: "El número de teléfono debe tener 10 dígitos",
          },
        },
      },
      servicesId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El color es obligatorio",
          },
          is: {
            args: /^([a-zA-Z]+\s*)+$/,
            msg: "Debe ingresar un color válido",
          },
        },
      },
      observations: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: {
            args: [0, 255],
            msg: "Las observaciones deben tener como máximo 255 carácteres",
          },
        },
      },
      fullPay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          isNumeric: {
            msg: "El valor del total a pagar debe ser un número",
          },
        },
      },
      advancePay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },
      remainingPay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  Order.beforeUpdate((order) => {
    if(order.advancePay > 0) {
      order.remainingPay = order.fullPay - order.advancePay
    }
  })

  return Order;