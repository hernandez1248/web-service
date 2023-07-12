import db from "database/models/index";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

export default function handler(req, res) {
  switch (req.method) {
    case "GET":
      return listUsers(req, res);
    case "POST":
      return addUsers(req, res);
    case "PUT":
      return editUsers(req, res);
    case "DELETE":
      return deleteUsers(req, res);

    default:
      res.status(400).json({ error: true, message: "Petición errónea" });
  }
}

// GET: usuarios
const listUsers = async (req, res) => {
  try {
    const { name } = req.query;

    let whereCondition = {}; 

    if (name) {
      whereCondition = {
        [Op.or]: [{
          name: {
            [Op.like]: `%${name}%`,
          },
        },
        {
          lastName: {
            [Op.like]: `%${name}%`,
          },
        }],
        
      };
    }
    const users = await db.User.findAll({
      where: whereCondition,
    });

    return res.json(users);
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: `Ocurrió un error al procesar la petición: ${error.message}`,
    });
  }
};

//POST: usuarios
const addUsers = async (req, res) => {
  try {
    //validar que venga la contraseña
    if (!req.body.password) {
      return res.status(400).json({ message: "La contraseña es obligatoria" });
    }

    //datos del usuario
    const datosUsuario = { ...req.body };

    // validar contrasena antes de cifrar
    if (datosUsuario.password.length < 8) {
      return res
      .status(400)
      .json({
        error: true,
        message: `Ocurrio un error al procesar la información`,
        errors: [
          {
            error: "La contrasena debe tener una longitud >= 8 carácteres.",
            field: 'password',
          }
        ],
      });
    }

    //asegurar la contraseña
    //usar bcrypt
    //salt: generación de una cadena aleatoria deN longitud
    const salt = await bcrypt.genSalt(10);

    //cifrar la contraseña y meterla en los datos del usuario
    datosUsuario.password = await bcrypt.hash(datosUsuario.password, salt);

    //guardar los datos del cliente
    const user = await db.User.create(datosUsuario);

    user.password = null; //evitar enviarlo en la respuesta

    res.json({ message: "El usuario ha sido registrado.", user });
  } catch (error) {
    console.log(error);

    let errors = [];

    if (error.errors) {
      //extraer la información de los campos que tienen error
      errors = error.errors.map((item) => ({
        error: item.message,
        field: item.path,
      }));
    }

    return res
      .status(400)
      .json({
        error: true,
        message: `Ocurrio un error al procesar la información: ${error.message}`,
        errors,
      });
  }
};

//PUT: usuarios
const editUsers = async (req, res) => {
  try {
    const { id } = req.query;
    const { password, ...userData } = req.body;

    if (password && password.length < 8) {
      return res.status(400).json({
        error: true,
        message: "La contraseña debe tener una longitud >= 8 caracteres.",
        field: "password",
      });
    }

    // Validar si se proporciona una nueva contraseña y cifrarla
    if (password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
    }

    await db.User.update(userData, {
      where: { id },
    });

    res.json({
      message: "El usuario ha sido actualizado.",
    });
  } catch (error) {
    console.log(error);
    let errors = [];
    if (error.errors) {
      errors = error.errors.map((item) => ({
        error: item.message,
        field: item.path,
      }));
    }
    return res.status(400).json({
      error: true,
      message: `Ocurrió un error al procesar la información: ${error.message}`,
      errors,
    });
  }
};


//DELETE: usuarios
const deleteUsers = async (req, res) => {
  try {
    //eliminar los datos del usuario
    const { id } = req.query;
    await db.User.destroy({
      where: {
        id: id,
      },
    });

    res.json({
      message: "El usuario ha sido eliminado.",
    });
  } catch (error) {
    console.log(error);
    let errors = [];
    if (error.errors) {
      //extraer la información de los campos que tienen error
      errors = error.errors.map((item) => ({
        error: item.message,
        field: item.path,
      }));
    }
    return res.status(400).json({
      error: true,
      message: `Ocurrio un error al procesar la información: ${error.message}`,
      errors,
    });
  }
};
