import React from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Container, Grid, TextField, InputLabel, Select, FormControl, MenuItem, Input, InputAdornment, Alert } from '@mui/material';
import { useForm } from "react-hook-form";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apiClient from '@/apiClient';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

import Slide from "@mui/material/Slide";

import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModalContentAddComponent = ({ recharge }) => {
  const [open, setOpen] = React.useState(false);
  const [devicesId, setDeviceId] = React.useState('');
  const [devices, setDevices] = useState([]);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors },
    setError,
    reset, 
  } = useForm();

 

  const onSubmit = (data) => {
    console.log(data);
    //enviar la informacion del formulario al backend
    apiClient.post('/api/components', data)
      .then((response) => {
        //console.log(response.data);
        // alert(response.data.message);
        Swal.fire({
          position: "center",
          icon: "success",
          // iconColor: "#223354",
          text: response.data.message,
          confirmButtonText: "Aceptar",
          // confirmButtonColor: "#223354"
        });
        setOpen(false);
        recharge();
        reset();

      })
      .catch((error) => {
        console.log(error);
        alert(error.response?.data?.message || 'Error al registrar el componente');

        if (error.response?.data?.errors) {
          error.response.data.errors.forEach((errorItem) => {
            setError(errorItem.field, {
              type: "validation",
              message: errorItem.error
            });
          })
        }
      })
  };

  useEffect(() => {
    /*Ir por los productos desde el backend */

    apiClient.get('api/device')
      .then(response => {
        setDevices(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  
  return (
    <>
      <Box item xs={6} md={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
         
        <Button
         
          onClick={handleClickOpen}
          sx={{ margin: "10px", backgroundColor: "#223354" }}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
            Agregar Componente
        </Button>
    </Box>
      <Dialog 
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
        >
        <DialogTitle
          sx={{
              display: "flex",
              justifyContent: "center",
          }}
      >
          Agregar Componente
      </DialogTitle>
          <DialogContent >
            <DialogContentText id="alert-dialog-slide-description" sx={{ padding: 2 }}>
              <Grid container spacing={2} sx={{ marginBottom: 10 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="name"
                    variant="outlined"
                    label="Nombre del componente"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {
                    ...register('name',
                      {
                        required: '*Este campo es obligatorio.',
                        pattern: {
                          value: /^[A-Z a-z áéíóú 0-9.\-/]+$/i,
                          message: 'No es un nombre válido.'
                        }
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField 
                    id="price"
                    variant="outlined"
                    label="Precio" 
                    fullWidth
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    {
                    ...register('price',
                      {
                        required: '*Este campo es obligatorio.',
                        pattern: {
                          value: /^[0-9]+(\.[0-9]+)?$/i,
                          message: 'No es un precio válido.'
                        }
                      })
                    }
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    id="stock"
                    variant="outlined"
                    label="Stock" 
                    fullWidth
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                    {
                    ...register('stock',
                      {
                        required: '*Este campo es obligatorio.',
                        pattern: {
                          value: /^[0-9]+(\.[0-9]+)?$/i,
                          message: 'No es un stock válido.'
                        }
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl sx={{ m: 0 }} fullWidth>
                    <InputLabel id="demo-simple-select-autowidth-label">Dispositivo al que pertenece</InputLabel>
                    <Select
                      id='deviceId'
                      {
                      ...register('deviceId',
                        {
                          required: '*Este campo es obligatorio.',
                          pattern: {
                            message: 'No es un dispositivo válido.'
                          }
                        })
                      }
                      onChange={ev => setDeviceId(ev.target.value)}
                      fullWidth
                      label="Selecciona el dispositivo"
                      error={!!errors.deviceId}
                      helperText={errors.deviceId?.message}

                    >
                      <MenuItem>Selecciona el dispositivo</MenuItem>
                        {devices.map((item) => (
                       <MenuItem key={item.id} value={item.id}>{`${item.brand} ${item.model}`}</MenuItem>

                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField 
                    id="image"
                    label="Url de la imagen del componente" 
                    fullWidth
                    error={!!errors.image}
                    helperText={errors.image?.message}
                    {
                    ...register('image',
                      {
                        required: '*Este campo es obligatorio.',
                        pattern: {
                          value: /^(https?|ftp|file):\/\/.+$/,
                          message: "La URL de la imagen no es válida. Debe ser una URL completa",
                        }
                      })
                    }
                  />
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
            <Button onClick={handleClose} variant="contained" color="error" >
               <HighlightOffIcon />
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              <SaveOutlinedIcon />
              Guardar
            </Button>
          </DialogActions>
        {/* </Container> */}

          <style jsx>
            {`
              .cancel{
                color: #FFFFFF;
                text-decoration: none;
              }`
            }
          </style>
      </Dialog>
    </>
  );
};

export default ModalContentAddComponent;