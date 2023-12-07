import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    IconButton,
    Grid,
    Typography,
    TableHead,
    Table,
    TableContainer,
    TableCell,
    TableRow,
    TableBody,
    Paper,
    Box,
    Tooltip,
    Container,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { ChromePicker } from 'react-color';
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import ListDetail from "../cards/listDetails";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import apiClient from "@/apiClient";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';


function ViewSingleOrderModal({ open, order, onClose, devices, states, details, userGenerateOrder, recharge, onSaved, rechargeDetails }) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [stateOrder, setStates] = React.useState({ ...states });
    const [deviceOrder, setDevices] = React.useState({ ...devices });
    const [deviceId, setDeviceId] = React.useState('');
    const [componentId, selectedComponentId] = React.useState('');
    const [editState, setEditState] = React.useState(false); //prueba 1
    const [editOrder, setEditOrder] = React.useState(false); //prueba 2
    const [editOrderDetailAdd, setEditOrderDetailAdd] = React.useState(false); //prueba 3
    const [categoriesDevice, setCategoriesDevice] = React.useState([]);
    const [componentIdAdd, setComponents] = React.useState([]);
    const [selectedComponent, setSelectedComponents] = React.useState([]);
    const [openColorPicker, setOpenColorPicker] = React.useState(false);
    const [selectedColor, setSelectedColor] = React.useState(order.color); // Color por defecto de la orden a editar
    const [selectedQuantity, setSelectedQuantity] = React.useState(1);

    const handleColorPickerOpen = () => {
        setOpenColorPicker(true);
    };

    const handleColorPickerClose = () => {
        setOpenColorPicker(false);
    };

    const handleColorChange = (color) => {
        setSelectedColor(color.hex);
    };

    const onSubmitState = (data,) => {
        data.id = stateOrder.id;
        console.log("Estado a actualizar:", stateOrder);
        apiClient.patch(`/api/states?id=${stateOrder.id}`, data)
            .then((response) => {
                console.log("Respuesta del servidor:", response.data);
                Swal.fire({
                    position: 'center',
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "Aceptar",

                });

                const swalContainer = document.querySelector(".swal2-container");

                // Establecer el zIndex directamente en el contenedor
                if (swalContainer) {
                    swalContainer.style.zIndex = "9999";
                }
                console.log(data);
                setEditState(false);
                recharge();
                //reset();
            })
            .catch((error) => {
                console.log("Error al actualizar estado:", error);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    text: error.response?.data?.message || 'Error al actualizar el estado',
                });

                const swalContainer = document.querySelector(".swal2-container");

                // Establecer el zIndex directamente en el contenedor
                if (swalContainer) {
                    swalContainer.style.zIndex = "9999";
                }
            });
    };

    const onSubmitOrder = (data,) => {
        data.id = order.id;
        data.color = selectedColor;
        console.log("Orden a actualizar:", order);
        apiClient.patch(`/api/orders?id=${order.id}`, data)
            .then((response) => {
                console.log("Respuesta del servidor:", response.data);
                Swal.fire({
                    position: 'center',
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "Aceptar",

                });

                const swalContainer = document.querySelector(".swal2-container");

                // Establecer el zIndex directamente en el contenedor
                if (swalContainer) {
                    swalContainer.style.zIndex = "9999";
                }
                console.log(data);
                setEditOrder(false);
                onSaved();
                //reset();
            })
            .catch((error) => {
                console.log("Error al actualizar orden:", error);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    text: error.response?.data?.message || 'Error al actualizar la orden',
                });

                const swalContainer = document.querySelector(".swal2-container");

                // Establecer el zIndex directamente en el contenedor
                if (swalContainer) {
                    swalContainer.style.zIndex = "9999";
                }
            });
    };

    const deleteDetailOrder = (id) => {
        console.log("ID a eliminar:", id);

        Swal.fire({
            title: "¿Estás Seguro de eliminar?",
            text: "Este detalle de orden se eliminara permanentemente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si, eliminar",

        })
            .then((result) => {
                if (result.isConfirmed) {
                    console.log("Eliminar detalle de orden con ID:", id);
                    apiClient.delete(`/api/orderDetails?id=${id}`)
                        .then((response) => {
                            console.log("Respuesta del servidor:", response.data);
                            Swal.fire({
                                position: "center",
                                icon: "success",
                                text: response.data.message,
                                confirmButtonText: "Aceptar"
                            });


                            const swalContainer = document.querySelector(".swal2-container");

                            // Establecer el zIndex directamente en el contenedor
                            if (swalContainer) {
                                swalContainer.style.zIndex = "9999";
                            }
                            rechargeDetails();
                        })
                        .catch((error) => {
                            console.log("Error al eliminar detalle de orden:", error);
                        });
                }
            });


        const swalContainer = document.querySelector(".swal2-container");

        // Establecer el zIndex directamente en el contenedor
        if (swalContainer) {
            swalContainer.style.zIndex = "9999";
        }
    };

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Función para formatear la hora
    const formatTime = (dateString) => {
        const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };

    const handleEditState = () => {
        setEditState(!editState);
    }

    const cancelEditState = () => {
        //setEditState(false);
        setEditState(false);
    }

    const handleEditOrder = () => {
        setEditOrder(!editOrder);
    }

    const cancelEditOrder = () => {
        setEditOrder(false);
    }

    const handleEditOrderDetailAdd = () => {
        setEditOrderDetailAdd(!editOrderDetailAdd);
    }

    const cancelEditOrderDetailAdd = () => {
        setEditOrderDetailAdd(false);
    }

    useEffect(() => {
        apiClient.get('api/device')
            .then(response => {
                setCategoriesDevice(response.data || []);
            })
            .catch(error => {
                console.log(error);
            });

        apiClient.get('api/components')
            .then(response => {
                setSelectedComponents(response.data || []);
            })
            .catch(error => {
                console.log(error);
            });

        setStates({ ...states });
        setDevices({ ...devices })
    }, [states, devices, order,]);


    /*useEffect(() => {
        const selectedComponent = selectedComponent.find(component => component.id === componentId);
        const totalPrice = selectedComponent?.price * selectedQuantity || 0; // Si no hay componente seleccionado, el total es 0
        // Aquí puedes hacer lo que necesites con el totalPrice, como mostrarlo en algún lugar o almacenarlo en un estado
    }, [selectedQuantity, componentId]);*/

    const componentAddOrderDetail = selectedComponent.find(component => component.id === componentId);

    const totalPrice = componentAddOrderDetail?.price * selectedQuantity || 0;

    useEffect(() => {

    }, [componentAddOrderDetail, totalPrice]);
    /*
       console.log("///////////COMPONENTE////////////////");
       console.log(selectedComponent);
       console.log(componentId);
       console.log("COMPONENTE SELECCIONADO");
       console.log(componentAddOrderDetail);
   
      useEffect(() => {
           setDevices({ ...devices })
       }, [devices]);*/


    const onSubmitOrderDetailAdd = (data) => {
        //data.id = order.id;
        //data.color = selectedColor;
        data.unitPrice = componentAddOrderDetail?.price,
            data.amountTotal = totalPrice,
            data.ordersId = order.id

        console.log("Detalle a agregar:", order);
        apiClient.post(`/api/orderDetails`, data)
            .then((response) => {
                console.log("Respuesta del servidor:", response.data);
                Swal.fire({
                    position: 'center',
                    icon: "success",
                    text: response.data.message,
                    confirmButtonText: "Aceptar",

                });

                const swalContainer = document.querySelector(".swal2-container");

                // Establecer el zIndex directamente en el contenedor
                if (swalContainer) {
                    swalContainer.style.zIndex = "9999";
                }
                setEditOrderDetailAdd(false);
                rechargeDetails();
                reset();
            })
            .catch((error) => {

                console.log("Error al actualizar orden:", error);

                Swal.fire({
                    position: "center",
                    icon: "error",
                    text: error.response?.data?.message || 'Error al agregar el detalle de orden',
                });

                const swalContainer = document.querySelector(".swal2-container");

                // Establecer el zIndex directamente en el contenedor
                if (swalContainer) {
                    swalContainer.style.zIndex = "9999";
                }
            });
    };



    const renderOrdersDetails = () => {
        return details.map((detail) => (

            <ListDetail
                details={detail}
                onDeleteDetail={deleteDetailOrder}
                setComponentList={setSelectedComponents}
                componentList={selectedComponent}
                //onSaved={loadOrders}
                onUpdateDetails={rechargeDetails}
                key={detail.id}
            />
        ));
    };
    //console.log(details);

    return (
        <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth>
            <DialogTitle>
                <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Informacion de la Orden
                    {!editOrder && (
                        <>
                            <Tooltip title="Editar datos">
                                <Button
                                    size="small"
                                    style={{
                                        borderRadius: "50%",
                                        minWidth: 0,
                                        padding: "6px",
                                        marginRight: "8px",
                                    }}
                                    onClick={handleEditOrder}
                                >
                                    <EditIcon fontSize="small" />
                                </Button>
                            </Tooltip>
                        </>
                    )}
                </Typography>
            </DialogTitle>
            <DialogContent>

                <Container
                    component="form"
                    onSubmit={handleSubmit(onSubmitOrder)}
                    method="post">
                    <Grid container>
                        <Typography variant="subtitle1" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                            Datos generales
                        </Typography>
                        {!editOrder && (
                            <>
                                <Grid container spacing={2} style={{ justifyContent: 'initial' }}>

                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body1">
                                            <strong>Fecha:</strong> {`${formatDate(order.date)} ${formatTime(order.date)}`}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={5}>
                                        <Typography variant="body1">
                                            <strong>Nombre del cliente:</strong> {order.fullName}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body1">
                                            <strong>Teléfono:</strong> {order.phone}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body1">
                                            <strong>Tipo de Servicio:</strong>{" "}
                                            {order.servicesId === 1 ? "Mantenimiento" : "Reparación"}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Typography variant="body1">
                                            <strong>Pago total:</strong>{" "}
                                            ${order.fullPay}
                                        </Typography>
                                    </Grid>


                                    <Grid item xs={12} md={5}>
                                        <Typography variant="body1">
                                            <strong>Pago adelantado:</strong>{" "}
                                            ${order.advancePay}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body1">
                                            <strong>Pago restante:</strong>{" "}
                                            ${order.remainingPay}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Typography variant="body1">
                                            <strong>Generada por:</strong>{" "}

                                            {userGenerateOrder.users && userGenerateOrder.users.map(user => (
                                                <span key={user.id}>{`${user.name} ${user.lastName}`}</span>
                                            ))}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                        {editOrder && (
                            <>
                                <Grid container spacing={2} style={{ justifyContent: 'initial' }}>

                                    <Grid item xs={12} md={3}>

                                        <TextField
                                            id="fullName"
                                            label="Nombre del cliente"
                                            fullWidth
                                            defaultValue={order.fullName}
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

                                    <Grid item xs={12} md={3}>
                                        <TextField label="Telefono" fullWidth
                                            id="phone"
                                            defaultValue={order.phone}
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

                                    <Grid item xs={12} md={3}>
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
                                                defaultValue={order.servicesId}
                                                label="Selecciona el tipo de servicio"
                                                error={!!errors.servicesId}
                                                helperText={errors.servicesId?.message}

                                            >
                                                <MenuItem value={1}>Mantenimiento</MenuItem>
                                                <MenuItem value={2}>Reparacion</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>


                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            id="advancePay"
                                            variant="outlined"
                                            label="Pago por adelantado"
                                            defaultValue={order.advancePay}
                                            fullWidth
                                            error={!!errors.advancePay}
                                            type='number'                                            helperText={errors.advancePay?.message}
                                            inputProps={{
                                              min: 0, // Valor mínimo permitido
                                              max: order?.fullPay, // Valor máximo permitido
                                            }}
                                            {
                                            ...register('advancePay',
                                                {
                                                    required: '*Este campo es obligatorio.',
                                                })
                                            }
                                        />
                                    </Grid>

                                </Grid>
                            </>
                        )}
                    </Grid>

                    <Typography variant="subtitle1" style={{ paddingBlockStart: '30px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        Datos del dispositivo
                    </Typography>
                    {!editOrder && (
                        <>
                            <Grid container spacing={2} style={{ justifyContent: 'initial' }}>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="body1">
                                        <strong>Marca del Dispositivo: </strong>
                                        {deviceOrder.brand}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <Typography variant="body1">
                                        <strong>Modelo del Dispositivo:</strong>
                                        {deviceOrder.model}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Typography variant="body1">
                                        <strong>Categoria Dispositivo:</strong> {''}
                                        {deviceOrder.deviceCategoryId === 1 ? 'Celular' : deviceOrder.deviceCategoryId === 2 ? 'Tableta' : deviceOrder.deviceCategoryId === 3 ? 'PC' : 'Laptop'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <Typography variant="body1">
                                        <strong>Color:</strong>{" "}
                                        <div style={{ display: "inline-flex", alignItems: "center" }}>
                                            <div
                                                style={{
                                                    width: "100px",
                                                    height: "15px",
                                                    backgroundColor: order.color,
                                                    marginLeft: "5px", // Puedes ajustar el margen según tus preferencias
                                                }}
                                            ></div>
                                        </div>
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} md={5}>
                                    <Typography variant="body1">
                                        <strong>Observaciones:</strong> {order.observations}
                                    </Typography>
                                </Grid>
                            </Grid>

                        </>
                    )}
                    {editOrder && (
                        <>
                            <Grid container spacing={2} style={{ justifyContent: 'initial' }}>
                                <Grid item xs={12} md={3}>
                                    <FormControl sx={{ m: 0 }} fullWidth>
                                        <InputLabel id="demo-simple-select-autowidth-label">
                                            Selecciona el dispositivo
                                        </InputLabel>
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
                                            defaultValue={order.deviceId}
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

                                <Grid item xs={12} md={3}>

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
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        label="Observaciones"
                                        fullWidth
                                        multiline
                                        maxRows={4}
                                        id="observations"
                                        defaultValue={order.observations}
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


                                <DialogActions>

                                    <Button
                                        size="small"
                                        //onClick={handleSave} 
                                        className="buttons"
                                        type="submit"
                                    //style={{ textTransform: 'none' }}
                                    >
                                        <SaveOutlinedIcon />
                                        Guardar
                                    </Button>

                                    <Button
                                        size="small"
                                        //style={{ textTransform: 'none' }}
                                        color="error"
                                        onClick={cancelEditOrder}
                                        className="buttons">
                                        <HighlightOffIcon />
                                        Cancelar
                                    </Button>

                                </DialogActions>
                            </Grid>
                        </>
                    )}
                </Container>
                {/* <EditOrderModal
                    open={editOrder}
                    order={order}
                    onClose={cancelEditOrder}
                    onUpdate={onUpdate}
                                />*/}

                <Container
                    component="form"
                    onSubmit={handleSubmit(onSubmitState)}
                    method="post">

                    <Grid container>
                        <Typography variant="subtitle1" style={{ paddingBlockStart: '30px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            Datos del status
                            {!editState && (
                                <Tooltip title="Editar datos">
                                    <Button
                                        size="small"
                                        style={{
                                            borderRadius: "50%",
                                            minWidth: 0,
                                            padding: "6px",
                                            marginRight: "8px",
                                        }}
                                        onClick={handleEditState}
                                    >
                                        <EditIcon fontSize="small" />
                                    </Button>
                                </Tooltip>
                            )}
                        </Typography>
                        {!editState && (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
                                        <Typography variant="body1">
                                            <strong>Status: </strong>
                                            {stateOrder.status}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <Typography variant="body1">
                                            <strong>Descripcion: </strong>
                                            {stateOrder.description}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </>

                        )}
                        {editState && (
                            <>

                                <Grid container spacing={2} >

                                    <Grid item xs={12} md={3}>
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="status">Status</InputLabel>
                                            <Select
                                                label="Status"
                                                defaultValue={stateOrder.status}
                                                id="status"
                                                name="status"
                                                error={!!errors.status}
                                                {...register("status", {
                                                    required: "Este campo es obligatorio",
                                                })}
                                            >
                                                <MenuItem value="Registrada">Registrada</MenuItem>
                                                <MenuItem value="Pendiente">Pendiente</MenuItem>
                                                <MenuItem value="Completada">Completada</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} md={4} >
                                        <TextField
                                            label="Descripcion"
                                            fullWidth
                                            multiline
                                            maxRows={4}
                                            id="description"
                                            defaultValue={stateOrder.description}
                                            error={!!errors.description}
                                            helperText={errors.description?.message}
                                            {...register('description',
                                                {
                                                    required: '*Este campo es obligatorio.',
                                                    pattern: {
                                                        value: /^[A-Z a-z áéíóú]+$/i,
                                                        message: 'No es un observacion valida.'
                                                    },
                                                    maxLength: {
                                                        value: 255,
                                                        message: 'La descripcion no debe exceder los 255 caracteres.',
                                                    },
                                                })}
                                        />
                                    </Grid>



                                    <DialogActions>
                                        <Button
                                            size="small"
                                            //onClick={handleSave} 
                                            className="buttons"
                                            type="submit"
                                        //style={{ textTransform: 'none' }}
                                        >
                                            <SaveOutlinedIcon />
                                            Guardar
                                        </Button>
                                        <Button
                                            size="small"
                                            //style={{ textTransform: 'none' }}
                                            color="error"
                                            onClick={cancelEditState}
                                            className="buttons">
                                            <HighlightOffIcon />
                                            Cancelar
                                        </Button>
                                    </DialogActions>
                                </Grid>
                            </>
                        )}
                    </Grid>

                </Container>
                {/* <EditStateOrderModal
                    open={editState}
                    state={stateOrder}
                    onClose={cancelEditState}
                    recharge={recharge}
                        />*/}



                {details.length > 0 && (
                    <>
                        <Container
                            component="form"
                            onSubmit={handleSubmit(onSubmitOrderDetailAdd)}
                            method="post"
                        >

                            <Grid container spacing={2}>

                                <Typography variant="subtitle1" style={{ paddingBlockStart: '30px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    Detalles de la orden

                                    {!editOrderDetailAdd && (

                                        <Tooltip title="Agregar un detalle">
                                            <Button
                                                color="primary"
                                                aria-label="Agregar detalle"
                                                onClick={handleEditOrderDetailAdd}
                                                size="small"  // Tamaño pequeño
                                                style={{ borderRadius: "50%" }} // Estilo para hacerlo redondo y darle un color
                                            >
                                                <AddCircleOutline />
                                            </Button>
                                        </Tooltip>

                                    )}
                                </Typography>

                                <Grid item xs={12}>
                                    <TableContainer component={Paper}>
                                        <Table aria-label="Order Table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell width={50} sx={{ color: '#000000', fontWeight: "700" }}>ID</TableCell>
                                                    <TableCell width={100} sx={{ color: '#000000', fontWeight: "700" }}>Componente</TableCell>
                                                    <TableCell width={40} sx={{ color: '#000000', fontWeight: "700" }}>Cantidad</TableCell>
                                                    <TableCell width={50} sx={{ color: '#000000', fontWeight: "700" }}>Precio unitario</TableCell>
                                                    <TableCell width={50} sx={{ color: '#000000', fontWeight: "700" }}>Monto</TableCell>
                                                    <TableCell width={50} sx={{ color: '#000000', fontWeight: "700" }}>Acciones</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {renderOrdersDetails()}

                                                {editOrderDetailAdd && (
                                                    <>
                                                        <TableRow >
                                                            <TableCell>{''}</TableCell>

                                                            <TableCell>

                                                                <Grid item>
                                                                    {<FormControl fullWidth>
                                                                        <InputLabel id="demo-simple-select-autowidth-label">Selecciona el componente</InputLabel>
                                                                        <Select
                                                                            id='componentsId'
                                                                            error={!!errors.componentsId}
                                                                            helperText={errors.componentsId?.message}
                                                                            {
                                                                            ...register('componentsId',
                                                                                {
                                                                                    required: '*Este campo es obligatorio.',
                                                                                })
                                                                            }
                                                                            onChange={ev => selectedComponentId(ev.target.value)}
                                                                            fullWidth
                                                                            label="Selecciona el componente"

                                                                        >
                                                                            {selectedComponent.map((item) => (
                                                                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                                                            ))}
                                                                        </Select>
                                                                    </FormControl>}
                                                                </Grid>
                                                            </TableCell>


                                                            <TableCell>
                                                                <Grid item xs={12} md={7}>
                                                                    {/*  <TextField
                                                                    label="Cantidad"
                                                                    fullWidth
                                                                    id="quantity"
                                                                    type="number"
                                                                    inputProps={{ min: 1, max: componentAddOrderDetail?.stock }} // Ajusta el valor mínimo según tus necesidades
                                                                    onChange={(event) => setSelectedQuantity(event.target.value)}
                                                                    error={!!errors.quantity}
                                                                    helperText={errors.quantity?.message}
                                                                    {...register('quantity', {
                                                                        required: '*Este campo es obligatorio.',
                                                                        min: {
                                                                            value: 1,
                                                                            message: 'La cantidad debe ser al menos 1.',
                                                                        },
                                                                    })}
                                                                 /> */}

                                                                    <TextField
                                                                        label="Cantidad"
                                                                        fullWidth
                                                                        id="quantityComponent"
                                                                        value={selectedQuantity}
                                                                        {
                                                                        ...register('quantityComponent',
                                                                            {
                                                                                required: '*Este campo es obligatorio.',
                                                                            })
                                                                        }
                                                                        type="number"
                                                                        inputProps={{ min: 1, max: componentAddOrderDetail?.stock }}
                                                                        onChange={(event) => setSelectedQuantity(event.target.value)}
                                                                        error={!!errors.quantityComponent}
                                                                        helperText={errors.quantityComponent?.message}
                                                                    />


                                                                </Grid>
                                                            </TableCell>
                                                            <TableCell>
                                                                {componentAddOrderDetail?.price}
                                                            </TableCell>
                                                            <TableCell>
                                                                {totalPrice}
                                                            </TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    aria-label="Guardar"
                                                                    //onClick={onSubmitOrderDetailAdd}
                                                                    style={{ color: "blue" }}
                                                                    type="submit"
                                                                >
                                                                    <SaveIcon />
                                                                </IconButton>
                                                                <IconButton
                                                                    aria-label="Cancelar"
                                                                    onClick={cancelEditOrderDetailAdd}
                                                                    style={{ color: "red" }}
                                                                >
                                                                    <CancelIcon />
                                                                </IconButton>
                                                            </TableCell>

                                                        </TableRow>
                                                    </>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </Container>
                    </>
                )
                }
                {/* aqui se puede agregar más secciones*/}
            </DialogContent >
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="error">
                    <IconButton color="inherit">
                        <CancelIcon />
                    </IconButton>
                    Cerrar
                </Button>
            </DialogActions>


        </Dialog >


    );
}

export default ViewSingleOrderModal;
