import db from "database/models/index";
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
    const user = await db.User.findAll({ ...req.body });
    return res.json(user);
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
    //eliminar los datos del usuario
    const { id } = req.query;
    await db.User.update(
      { ...req.body },
      {
        where: {
          id,
        },
      }
    );

    res.json({
      message: "El usuario ha sido actualizado.",
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
