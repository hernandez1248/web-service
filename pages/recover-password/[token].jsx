import apiClient from "@/apiClient";
import { Box, Button, Container, Grid, Paper, TextField, Typography, } from "@mui/material";
import { useState } from "react";
import db from "database/models/index";
import { Op } from "sequelize";
import Head from "next/head";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const RecoverPassword = (props) => {
  const { token } = props;
  const [mensaje, setMensaje] = useState(props.message);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [mostrar, setMostrar] = useState(props.token ? "form" : "result");
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => {
    setPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
    if (password && e.target.value !== password) {
      setPasswordError("Las contraseñas no coinciden");
    } else {
      setPasswordError("");
    }
  };

  const handleRecovery = (e) => {
    e.preventDefault();

    //realizar envío de nueva contraseña
    apiClient
      .post("/password/change", { password, token })
      .then((response) => {
        console.log(response.data);
        setMostrar("result");
        setMensaje(response.data.message);
      })
      .catch((error) => {
        console.log(error);
        setMostrar("result");
        setMensaje(
          error.message || "Error al intentar guardar la nueva contraseña."
        );
      });
  };

  const renderContent = () => {
    if (mostrar === "form") {
      return (
        //Formulario
        <form onSubmit={handleRecovery} noValidate>
          <Grid
            container
            spacing={4}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Grid item xs={12} md={8} sx={{ my: 3 }}>
              <Typography
                color="primary"
                variant="h5"
                mt={6}
                sx={{ fontWeight: "bold" }}
              >
                Ingresa la nueva contraseña
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TextField
                  margin="normal"
                  variant="standard"
                  required
                  fullWidth
                  name="password"
                  type={showPwd ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={handleChange}
                  error={!!passwordError}
                  helperText={passwordError}
                />
                <div
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? (
                    <VisibilityIcon className="eyeFill" />
                  ) : (
                    <VisibilityOffIcon className="eyeFill" />
                  )}
                </div>
              </Box>
              <Typography
                color="primary"
                variant="h5"
                mt={6}
                sx={{ fontWeight: "bold" }}
              >
                Confirmar contraseña
              </Typography>
              <TextField
                margin="normal"
                variant="standard"
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                value={confirmPassword}
                onChange={handleConfirmChange}
                error={!!passwordError}
                helperText={passwordError}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              sx={{ fontSize: "20px", width: "67%", marginBottom: "30px" }}
              variant="contained"
            >
              Restablecer contraseña
            </Button>
          </Grid>
        </form>
      );
    }

    return (
      <Typography sx={{ marginTop: 8, textAlign: "center" }} variant="h6">
        {mensaje}
      </Typography>
    );
  };

  return (
    //Renderizado
    <Container>
      <Head>
        <title>Recuperar Contraseña.</title>
      </Head>
      <Paper>
        <Typography
          variant="h4"
          mt={2}
          sx={{ fontWeight: "bold"}}
          textAlign={"center"}
        >
          Recuperar contraseña
        </Typography>
        {renderContent()}
      </Paper>
    </Container>
  );
};

export async function getServerSideProps({ req, res, params }) {
  // Leer el token
  const { token } = params;
  console.log(token);

  //Buscar el usuario mediante el token de recuperacion
  const user = await db.User.findOne({
    where: {
      passwordResetToken: token,
      passwordResetExpire: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    return {
      props: {
        token: null,
        message:
          "El link de recuperacion de contraseña es invalido o ha expirado",
      },
    };
  }

  return {
    props: {
      token,
      message: "Ingresar la nueva contraseña",
    },
  };
}

export default RecoverPassword;
