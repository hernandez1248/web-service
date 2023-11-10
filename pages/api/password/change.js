import db from "database/models/index";
import bcrypt from "bcrypt";
import { passwordEmail } from "@/utils/passwordEmail";
import { Op } from "sequelize";

export default async function handler(req, res) {
  try {
    //buscar usuario
    const user = await db.User.findOne({
      where: {
        passwordResetToken: req.body.token,
        passwordResetExpire: { [Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({
        error: true,
        message: "El link de recuperación es inválido o ha expirado.",
      });
    }

    if (!req.body.password) {
      return res.status(400).json({
        error: true,
        message: "La contraseña es obligatoria.",
      });
    }

    const salt = await bcrypt.genSalt(10);

    //cifrar la contraseña y meterla en los datos del usuario
    user.password = await bcrypt.hash(req.body.password, salt);

    //limpiar el token
    user.passwordResetToken = '' ; 
    user.passwordResetExpire = null;
     
    await user.save();

    res.json({
        message: 'La contraseña ha sido actualizada correctamente.',
    });
  } catch (error) {
    console.log(error);

    res.json({ error: true, message: "Error al guardar la nueva contraseña." });
  }
}
