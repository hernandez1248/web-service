import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Box, FormControl, Grid, InputAdornment, InputLabel, Menu, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { useForm } from "react-hook-form";
import apiClient from "@/apiClient";
import Swal from "sweetalert2";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { ChromePicker } from 'react-color';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddOrder({ recharge, user }) {
    const [open, setOpen] = React.useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [componentsId, setComponentId] = React.useState('');
    const [deviceId, setDeviceId] = React.useState('');
    const [componentDetail, setComponentDetails] = React.useState('');
    const [categoriesDevice, setCategoriesDevice] = useState([]);

    const [componentDetaillAdd, setComponentDetaillAdd] = useState([]);
    const [openColorPicker, setOpenColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#000000"); // Color por defecto negro


    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseClick = () => {
        setAnchorEl(null);
    };


    const [detalles, setDetalles] = useState([]);

    const handleDetalleChange = (event, index, field) => {
        const value = event.target.value;
        const updatedDetalles = [...detalles];

        // Actualizar el valor correspondiente del campo en el detalle de compra
        updatedDetalles[index] = {
            ...updatedDetalles[index],
            [field]: value,
        };

        setDetalles(updatedDetalles);
    };
    const agregarDetalle = () => {
        setDetalles([...detalles, {}]);
    };

    const handleColorPickerOpen = () => {
        setOpenColorPicker(true);
    };

    const handleColorPickerClose = () => {
        setOpenColorPicker(false);
    };

    const handleColorChange = (color) => {
        setSelectedColor(color.hex);
    };
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

    const handleRemoveDetaill = (index) => {
        const updatedDetails = [...detalles];
        updatedDetails.splice(index, 1);
        setDetalles(updatedDetails);
    };
    const handleRemoveDetail = (index) => {
        setDetalles((prevDetalles) => {
            const updatedDetalles = prevDetalles.filter((_, i) => i !== index);
            return updatedDetalles;
        });
    };

    /*
        const onSubmit = (data) => {
            const dataToSend = {
                ...data,
                color: selectedColor,
                userId: user?.id,
                detalles: detalles
            };
    
            console.log(dataToSend);
    
            apiClient.post("/api/orders", dataToSend)
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
                    alert(error.response?.data?.message || 'Error al registrar la orden');
                    if (error.response?.data?.errors) {
                        error.response.data.errors.forEach((errorItem) => {
                            setError(errorItem.field, {
                                type: "validation",
                                message: errorItem.error,
                            });
                        });
                    }
                });
        };*/

    console.log("EL COLOR ES:");
    console.log(selectedColor);

    useEffect(() => {
        /*Ir por los productos desde el backend */

        apiClient.get('api/device')
            .then(response => {
                setCategoriesDevice(response.data || []);
            })
            .catch(error => {
                console.log(error);
            });

        apiClient.get('api/components')
            .then(response => {
                setComponentDetaillAdd(response.data || []);
            })
            .catch(error => {
                console.log(error);
            });

    }, []);

    const componentAddDetail = componentDetaillAdd.find(component => component.id === componentsId);

    useEffect(() => {
        setComponentD({ ...componentAddDetail })
    }, [componentAddDetail]);
    const [componentD, setComponentD] = React.useState({ ...componentAddDetail });

    const onSubmit = (data) => {
        const dataToSend = {
            ...data,
            color: selectedColor,
            userId: user?.id,
            detalles
        };

        console.log(dataToSend);

        apiClient.post("/api/orders", dataToSend)
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
                alert(error.response?.data?.message || 'Error al registrar la orden');
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
                    Agregar orden
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
                    Agregar Orden
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        <Grid container spacing={2} mt={0}>


                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="fullName"
                                    label="Nombre del usuario"
                                    fullWidth
                                    error={!!errors.fullName}
                                    helperText={errors.fullName?.message}
                                    {
                                    ...register('fullName',
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

                            <Grid item xs={12} md={6}>
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <InputLabel id="demo-simple-select-autowidth-label">Selecciona el tipo de servicio</InputLabel>
                                    <Select
                                        id='servicesId'
                                        {
                                        ...register('servicesId',
                                            {
                                                required: '*Este campo es obligatorio.',
                                                pattern: {
                                                    message: 'No es un servicio valido.'
                                                }
                                            })
                                        }
                                        fullWidth
                                        label="Selecciona el tipo de servicio"
                                        error={!!errors.servicesId}
                                        helperText={errors.servicesId?.message}

                                    >
                                        <MenuItem value={1}>Mantenimiento</MenuItem>
                                        <MenuItem value={2}>Reparación</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl sx={{ m: 0 }} fullWidth>
                                    <InputLabel id="demo-simple-select-autowidth-label">Selecciona el dispositivo</InputLabel>
                                    <Select
                                        id='deviceId'
                                        {
                                        ...register('deviceId',
                                            {
                                                required: '*Este campo es obligatorio.',
                                                pattern: {
                                                    message: 'No es un dispositivo valido.'
                                                }
                                            })
                                        }
                                        onChange={ev => setDeviceId(ev.target.value)}
                                        fullWidth
                                        label="Selecciona el dispositivo"
                                        error={!!errors.deviceId}
                                        helperText={errors.deviceId?.message}

                                    >
                                        {categoriesDevice.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>{item.model}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} >
                                <TextField
                                    label="Observaciones"
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                    id="observations"
                                    error={!!errors.observations}
                                    helperText={errors.observations?.message}
                                    {...register('observations',
                                        {
                                            required: '*Este campo es obligatorio.',
                                            pattern: {
                                                value: /^[A-Z a-z áéíóú]+$/i,
                                                message: 'No es un observacion valida.'
                                            },
                                            maxLength: {
                                                value: 255,
                                                message: 'Las observaciones no deben exceder los 255 caracteres.',
                                            },
                                        })}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Button
                                    onClick={handleColorPickerOpen}
                                    variant="contained"
                                    fullWidth
                                    style={{ backgroundColor: selectedColor, color: "#fff" }}
                                >
                                    Seleccionar el color
                                </Button>
                            </Grid>

                            <Dialog open={openColorPicker} onClose={handleColorPickerClose}>
                                <DialogTitle>Selecciona un color</DialogTitle>
                                <DialogContent>
                                    <ChromePicker
                                        color={selectedColor}
                                        onChange={handleColorChange}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleColorPickerClose} variant="outlined">
                                        Cancelar
                                    </Button>
                                    <Button onClick={handleColorPickerClose} variant="contained">
                                        Aceptar
                                    </Button>
                                </DialogActions>
                            </Dialog>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Pago por adelantado"
                                    fullWidth
                                    id="advancePay"
                                    type="number"
                                    defaultValue={0}
                                    InputProps={{
                                        inputProps: {
                                            min: 0, // Establece el valor mínimo según tus necesidades
                                            step: 1.00, // Define el paso, por ejemplo, para permitir centavos
                                        },
                                        startAdornment: <InputAdornment position="start">$</InputAdornment>, // Agrega un símbolo de dólar
                                    }}
                                    error={!!errors.advancePay}
                                    helperText={errors.advancePay?.message}
                                    {...register('advancePay', {
                                        min: {
                                            value: 0, // Establece el valor mínimo según tus necesidades
                                            message: 'Ingrese un monto valido',
                                        },
                                    })}
                                />
                            </Grid>




                            <Button onClick={agregarDetalle}>Agregar detalle</Button>

                            {detalles.map((detalle, index) => (
                                <Grid container spacing={6} key={index}>

                                    <Grid item xs={12} md={6}>


                                        <FormControl sx={{ m: 2 }} fullWidth>
                                            <InputLabel id="demo-simple-select-autowidth-label">Selecciona el componente</InputLabel>
                                            <Select
                                                id='componentsId'
                                                //onChange={(e) => handleDetalleChange(e, index, 'componentsId')}                                                
                                                //onChange={ev => setComponentId(ev.target.value)}
                                                onChange={(event) => {
                                                    setComponentId(event.target.value);
                                                    handleDetalleChange(event, index, 'componentsId');
                                                }}
                                                fullWidth
                                                value={detalle.componentsId}
                                                label="Selecciona el componente"
                                                error={!!errors.componentsId}
                                                helperText={errors.componentsId?.message}

                                            >
                                                {componentDetaillAdd.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <FormControl fullWidth>
                                            <TextField
                                                sx={{ m: 2 }}
                                                label="Cantidad"
                                                fullWidth
                                                id="quantityComponent"
                                                value={detalle.quantityComponent}
                                                //value={selectedQuantity}
                                                type="number"
                                                inputProps={{ min: 1, max: componentD.stock }}
                                                onChange={(e) => handleDetalleChange(e, index, 'quantityComponent')}
                                                //onChange={(event) => setSelectedQuantity(event.target.value)}
                                                error={!!errors.quantityComponent}
                                                helperText={errors.quantityComponent?.message}
                                            />

                                        </FormControl>




                                    </Grid>

                                    <Grid item xs={12} md={1}>
                                        <FormControl sx={{ m: 2 }} fullWidth>


                                            <Tooltip title="Quitar detalle">
                                                <Button
                                                    size="small"
                                                    style={{
                                                        borderRadius: "100%",
                                                        minWidth: 0,
                                                        padding: "6px",
                                                        marginRight: "8px",
                                                        marginLeft: '10px', marginTop: '15px'
                                                    }}
                                                    onClick={() => handleRemoveDetail(index)}
                                                >
                                                    <CancelIcon fontSize="small" />
                                                </Button>
                                            </Tooltip>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            ))}














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
