import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { getProviders, getSession, signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Alert, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

const LoginPage = () => {
  const router = useRouter();
  const { query } = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [ showError, setShowError ] = useState(false);
  const [providers, setProviders] = useState({});

  useEffect(() => {
    getProviders().then( prov => {
      setProviders(prov)
    });
  
    if (router.query.error && router.query.error === 'CredentialsSignin') {
      setShowError(true);
    }
  }, []);

  const onLoginUser = async( { email, password }) => {

    setShowError(false);

    await signIn('credentials',{ email, password });
  }

  return(
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'purple' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingresar
          </Typography>
          <Grid item xs={12} sx={{ my: 3}}>
              <Chip 
                  label="La credencial ingresada es incorrecta."
                  color="error"
                  icon={ <ErrorOutline /> }
                  className="fadeIn"
                  sx={{ display: showError ? 'flex': 'none' }}
              />
              {(query.error && query.error !== 'CredentialsSignin')&& (
                <Alert severity="error">{query.error}</Alert>
              )}
          </Grid>
          <Box component="form" onSubmit={ handleSubmit(onLoginUser) } noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Correo electrónico"
              autoFocus
              { ...register('email', {
                required: 'Este campo es requerido',
              })}
              error={ !!errors.email }
              helperText={ errors.email?.message }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              { ...register('password', {
                required: 'Este campo es requerido',
              })}
              error={ !!errors.password }
              helperText={ errors.password?.message }
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Recordarme"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Ingresar
            </Button>
            {/*<Grid container>
              <Grid item xs>
                <Link href="#">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Grid>
            </Grid>*/}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

// si logra ser autenticado, regresarlo a la página que intentó acceder
export const getServerSideProps = async ({ req, query }) => {
  const session = await getSession({ req });

  const { p = 'hola' } = query;

  if ( session ) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }

  return {
    props: { }
  }
}

export default LoginPage;
