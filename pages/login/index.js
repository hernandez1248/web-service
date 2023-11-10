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
import { getProviders, getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Alert, Chip } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const theme = createTheme();

const LoginPage = () => {
  const router = useRouter();
  const { query } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = React.useState({});
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    getProviders().then((prov) => {
      setProviders(prov);
    });

    if (router.query.error && router.query.error === "CredentialsSignin") {
      setShowError(true);
    }
  }, []);

  const onLoginUser = async ({ email, password }) => {
    setShowError(false);
    await signIn("credentials", { email, password });
  };

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
          backgroundImage:
            "url(https://blogcomparasoftware-192fc.kxcdn.com/wp-content/uploads/2022/07/it-que-es.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onLoginUser)}
          noValidate
          sx={{
            width: 500,
            p: 4,
            backgroundColor: "rgba(255, 255, 255)",
            borderRadius: "10px",
            boxShadow: 3,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            SmartDeviceSolutions
          </Typography>
          <Typography
            component="h4"
            variant="h6"
            sx={{ mt: 4, textAlign: "center", fontWeight: "bold" }}
          >
            Ingresa tus credenciales
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            {...register("email", {
              required: "Este campo es requerido",
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? "text" : "password"} 
            id="password"
            autoComplete="current-password"
            {...register("password", {
              required: "Este campo es requerido",
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Grid item xs={12} sx={{ my: 3 }}>
            <Chip
              label="La credencial ingresada es incorrecta."
              color="error"
              icon={<ErrorOutline />}
              className="fadeIn"
              sx={{ display: showError ? "flex" : "none" }}
            />
            {query.error && query.error !== "CredentialsSignin" && (
              <Alert severity="error">{query.error}</Alert>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ textAlign: "center", fontWeight: 'bold' }}
          >
            Iniciar sesión
          </Button>
          <Grid container sx={{ mt: 3, textAlign: "center" }}>
            <Grid item xs>
              <Link href="restore" variant="body2">
                ¿Olvidaste tu contraseña?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

// si logra ser autenticado, regresarlo a la página que intentó acceder
export const getServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });

  const { p = "home" } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default LoginPage;
