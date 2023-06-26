"use strict";
import bcrypt from "bcrypt";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING(64),
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
      lastName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "El apellido es obligatorio",
          },
          is: {
            args: /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/,
            msg: "El apellido debe contener solo letras, espacios y acentos",
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
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "El email es obligatorio",
          },
          isEmail: {
            msg: "Debe ingresar un email valido",
          },
        },
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          notNull: {
            msg: "La contraseña es obligatorio",
          },
          len: {
            args: [8, 255],
            msg: "La contraseña debe contener minimo 8 caracteres",
          },
        },
      },
      rol: {
        type: DataTypes.STRING(16),
        allowNull: false,
        defaultValue: "empleado",
        validate: {
          isIn: {
            args: [["admin", "empleado"]],
            msg: "El rol debe ser 'admin' o 'empleado'",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.prototype.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};