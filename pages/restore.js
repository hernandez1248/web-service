import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import apiClient from "@/apiClient";
import Swal from 'sweetalert2';

const theme = createTheme();

const Restore = () => {
  const { register, handleSubmit,  formState: { errors }, setError, reset} = useForm();
  const onSubmit = (data) => {
    console.log(data);
    apiClient.post('/api/password/recover', data)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data); 
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: response.data.message,
        })
        reset()
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          position: 'center',
          icon: 'error',
          text: error.response.data.message,
        })
        if (error.response.data.errors) {
          error.response.data.errors.forEach((errorItem) => {
            setError(errorItem.field, {
              //error: true,
              type: "validation",
              message: errorItem.error
            });
          })
        }
      });
  }
  
 
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        component="main"
        maxWidth="xl"
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center", 
          backgroundImage: 'url(https://blogcomparasoftware-192fc.kxcdn.com/wp-content/uploads/2022/07/it-que-es.jpg)',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Box
          component="form"
          onSubmit={ handleSubmit(onSubmit) }
          noValidate
          sx={{
            width: 500,
            p: 4,
            backgroundColor: "rgba(255, 255, 255)",
            borderRadius: "10px",
            boxShadow: 3,
          }}
        >
          <Typography component="h1" variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold'}}>
            SmartDeviceSolutions
          </Typography>
          <Typography component="h4" variant="h6" sx={{ mt: 4, textAlign: 'center', fontWeight: 'bold'}}>
            Ingresa tu correo electrónico para obtener un enlace de recuperación
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            { ...register('email', {
              required: 'El email es obligatorio',
              pattern: {
                value: /(.+)@(.+){2,}\.(.+){3,}/i,
                message: 'No es un email Válido'
              }
            })}
            error={ !!errors.email }
            helperText={ errors.email?.message }
          />
          <Button type="submit" fullWidth variant="contained" sx={{ textAlign: 'center', fontWeight: 'bold'}}>
            Enviar enlace
          </Button>
          <Grid container sx={{ mt: 3, textAlign: 'center',}}>
            <Grid item xs>
              <Link href="login" variant="body2">
                ¿Recuerdas tu contraseña?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Restore;