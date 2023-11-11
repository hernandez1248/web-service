import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import apiClient from "@/apiClient";
import Swal from "sweetalert2";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddDevice({ recharge }) {
    const [open, setOpen] = React.useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [devicesId, setComponentId] = React.useState('');
    const [categories, setCategoriesDevice] = useState([]);


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        reset,
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        apiClient.post("/api/device", data)
            .then((response) => {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "Aceptar"
                });
                setOpen(false);
                recharge();
                reset();
            })
            .catch((error) => {
                console.log(error);
                alert(error.response?.data?.message || 'Error al registrar el dispositivo');
                if (error.response?.data?.errors) {
                    error.response.data.errors.forEach((errorItem) => {
                        setError(errorItem.field, {
                            type: "validation",
                            message: errorItem.error,
                        });
                    });
                }
            });
    };

    useEffect(() => {

        apiClient.get('/api/categories')
          .then(response => {
            setCategoriesDevice(response.data || []);
          })
          .catch(error => {
            console.log(error);
          });
    
      }, []);

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    onClick={handleClickOpen}
                    sx={{ margin: "10px", backgroundColor: "#223354" }}
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                >
                    Agregar dispositivo
                </Button>
            </Box>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                component={"form"}
                onSubmit={handleSubmit(onSubmit)}
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        fontSize: 25,
                        fontWeight: "bold",
                    }}
                >
                    Agregar Dispositivo
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <Grid container spacing={2} mt={0}>
                            <Grid item xs={12}>
                                <TextField
                                    id="brand"
                                    variant="outlined"
                                    fullWidth
                                    label="Marca del dispositivo"
                                    error={!!errors.brand}
                                    helperText={errors.brand?.message}
                                    {...register("brand", {
                                        required: "Este campo es obligatorio",
                                        pattern: {
                                            value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g,
                                            message: "El nombre de la marca solo debe contener letras",
                                        },
                                    })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="model"
                                    variant="outlined"
                                    fullWidth
                                    label="Modelo del dispositivo"
                                    error={!!errors.model}
                                    helperText={errors.model?.message}
                                    {...register("model", {
                                        required: "Este campo es obligatorio",
                                        pattern: {
                                            value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ 0-9]+$/i,
                                            message: "No es un modelo valido.",
                                        },
                                    })}
                                />
                            </Grid>






                            <Grid item xs={12}>
                <TextField
                  id="image"
                  variant="outlined"
                  fullWidth
                  label="URL image"
                  error={!!errors.image}
                  helperText={errors.image?.message}
                  {...register("image", {
                    required: "Este campo es obligatorio",
                    pattern: {
                      value: /^(https?|ftp|file):\/\/.+$/,
                      message: "La URL de la imagen no es válida. Debe ser una URL completa",
                    },
                  })}
                />
              </Grid>






                            <Grid item xs={12} md={6}>
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <InputLabel id="demo-simple-select-autowidth-label">Categoria del dispositivo</InputLabel>
                                    <Select
                                        id='deviceCategoryId'
                                        {
                                        ...register('deviceCategoryId',
                                            {
                                                required: '*Este campo es obligatorio.',
                                                pattern: {
                                                    message: 'No es un dispositivo valido.'
                                                }
                                            })
                                        }
                                        onChange={ev => setComponentId(ev.target.value)}
                                        fullWidth
                                        label="Categoria del dispositivo"
                                        error={!!errors.deviceCategoryId}
                                        helperText={errors.deviceCategoryId?.message}

                                    >
                                        {categories.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{item.type}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>





                        </Grid>
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginRight: "80px",
                        marginLeft: "80px",
                        marginBottom: "5px",
                    }}
                >
                    <Button onClick={handleClose} variant="contained" color="error">
                        <IconButton color="inherit">
                            <CancelIcon />
                        </IconButton>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="success">
                        <IconButton color="inherit">
                            <AddCircleIcon />
                        </IconButton>
                        Agregar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
