import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Container, Grid, TextField, InputLabel, Select, FormControl, MenuItem, Input, InputAdornment } from '@mui/material';
import { useForm } from "react-hook-form";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apiClient from '@/apiClient';

const ModalContentAddUser = ({ open, handleClose }) => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = (data) => {

        //enviar la informacion del formulario al backend
        apiClient.post('/api/users', data)
            .then((response) => {
                //console.log(response.data);
                alert(response.data.message);
            })
            .catch((error) => {
                //console.log(error);
                alert(error.response.data.message);

                if (error.response.data.errors) {
                    error.response.data.errors.forEach((errorItem) => {
                        setError(errorItem.field, {
                            type: "validation",
                            message: errorItem.error
                        });
                    })
                }
            })
    };

    const [categoryId, setCategoria] = React.useState('');

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Registrar usuario</DialogTitle>


            <Container component="form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Grid container spacing={2} sx={{ marginBottom: 8 }}>


                        <Grid item xs={12} md={6}>
                            <TextField
                                id="name"
                                label="Nombre del usuario"
                                fullWidth
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                {
                                ...register('name',
                                    {
                                        required: '*Este campo es obligatorio.',
                                        pattern: {
                                            value: /^[A-Z a-z áéíóú]+$/i,
                                            message: 'No es un nombre valido.'
                                        }
                                    })
                                }
                            />
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <TextField
                                id="lastName"
                                label="Apellidos del usuario"
                                fullWidth
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                                {
                                ...register('lastName',
                                    {
                                        required: '*Este campo es obligatorio.',
                                        pattern: {
                                            value: /^[A-Z a-z áéíóú]+$/i,
                                            message: 'No es un apellido valido.'
                                        }
                                    })
                                }
                            />
                        </Grid>


                        <Grid item xs={12} md={6}>
                            <TextField label="Email" fullWidth
                                id="email"
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                {
                                ...register('email',
                                    {
                                        required: '*Este campo es obligatorio.',
                                        pattern: {
                                            value: /(.+)@(.+){2,}\.(.+){2,}/i,
                                            message: 'No es un email valido.'
                                        }
                                    })
                                }
                            />
                        </Grid>


                        <Grid item xs={12} md={6}>
                            <TextField label="Telefono" fullWidth
                                id="phone"
                                error={!!errors.phone}
                                helperText={errors.phone?.message}
                                {
                                ...register('phone',
                                    {
                                        required: '*Este campo es obligatorio.',
                                        pattern: {
                                            value: /^[0-9]{2}[0-9]{8}$/i,
                                            message: 'No es un telefono valido.'
                                        }
                                    })
                                }
                            />
                        </Grid>


                        {<Grid item xs={12} md={6}>
                            <FormControl sx={{ m: 0 }} fullWidth>
                                <InputLabel id="demo-simple-select-autowidth-label">Selecciona el rol</InputLabel>
                                <Select
                                    id='rol'
                                    {
                                    ...register('rol',
                                        {
                                            required: '*Este campo es obligatorio.',
                                            pattern: {
                                                message: 'No es un rol valido.'
                                            }
                                        })
                                    }
                                    fullWidth
                                    label="Selecciona el dispositivo"
                                    error={!!errors.rol}
                                    helperText={errors.rol?.message}

                                >
                                    <MenuItem value="empleado">empleado</MenuItem>
                                    <MenuItem value="admin">admin</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>}

                        <Grid item xs={12} md={6}>
                            <TextField
                                id='password'
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type="password"
                                autoComplete="current-password"
                                error={!!errors.password}
                                helperText={errors.password?.message}

                                {
                                ...register('password',
                                    {
                                        required: '*Este campo es obligatorio.',
                                        pattern: {
                                            value: /^[0-9 A-Z a-z]+$/i,
                                            message: 'No es una contraseña valida.'
                                        },

                                    })
                                }
                            />
                        </Grid>


                        <alertPerson />
                        <Grid item xs={12} spacing={2} sx={{ textAlign: 'center' }}>
                        </Grid>

                    </Grid>

                </DialogContent>


                <DialogActions>


                    <Button type="submit" variant="contained">
                        <SaveOutlinedIcon />
                        Guardar
                    </Button>

                    <Button onClick={handleClose} variant='contained' color="error">
                        <HighlightOffIcon />
                        Cancel
                    </Button>
                </DialogActions>
            </Container>

            <style jsx>{`
                        .cancel{
                        color: #FFFFFF;
                        text-decoration: none;
                        }
                        `}</style>
        </Dialog>
    );
};

export default ModalContentAddUser;
