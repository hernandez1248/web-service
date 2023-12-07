const nodemailer = require("nodemailer");

exports.passwordEmail = async (name, email, token) => {
    try{
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.SMTP_USER, // generated ethereal user
              pass: process.env.SMTP_PASSWORD, // generated ethereal password
            },
          });

    // mensaje
    let message = `Hola, ${name}<br>`;
    message += "Has solicitado restaurar tu contraseña, "; 
    message += `<a href ="https://web-service-production-584c.up.railway.app/recover-password/${token}">Haz click aquí</a><br><br>`;
    message += "El enlace es valido por una hora.";

    let info = await transporter.sendMail({
      from: `Jesús Hernández<${process.env.SMTP_USER}>`, // sender address
      to: email, // list of receivers
      subject: "Recuperación de contraseña", // Subject line
      html: message, // html body
    });

      console.log("Message sent: %s", info.messageId);

      return true;
    }   catch (error) {
        console.log(error);
        return false;
    }
}
