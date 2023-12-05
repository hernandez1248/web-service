import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Container, Grid, TextField, InputLabel, Select, FormControl, MenuItem, Input, InputAdornment, Alert } from '@mui/material';
import { useForm } from "react-hook-form";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apiClient from '@/apiClient';
import { useState, useEffect } from 'react';

const ModalContentAddOrder = ({ open, handleClose }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const [devicesId, setDeviceId] = React.useState('');
  const [ordersId, setOrderId] = React.useState('');
 

  const [categoriesDevice, setCategoriesDevice] = useState([]);
  const [categoriesUser, setCategoriesUser] = useState([]);

  const onSubmit = (data) => {
    //enviar la informacion del formulario al backend
    apiClient.post('/api/orders', data)
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

  useEffect(() => {
    /*Ir por los productos desde el backend */

    apiClient.get('api/device')
      .then(response => {
        setCategoriesDevice(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });

    apiClient.get('api/users')
      .then(response => {
        setCategoriesUser(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Registrar orden</DialogTitle>


      <Container component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginBottom: 8 }}>


            <Grid item xs={12} md={6}>
              <TextField
                id="fullName"
                label="Nombre del cliente"
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


            {<Grid item xs={12} md={6}>
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
                  <MenuItem value={2}>Reparacion</MenuItem>
                </Select>
              </FormControl>
            </Grid>}


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

            <Grid item xs={12} md={6}>
              <FormControl sx={{ m: 0 }} fullWidth>
                <InputLabel id="demo-simple-select-autowidth-label">Selecciona el usuario</InputLabel>
                <Select
                  id='userId'
                  {
                  ...register('userId',
                    {
                      required: '*Este campo es obligatorio.',
                      pattern: {
                        message: 'No es un dispositivo valido.'
                      }
                    })
                  }
                  onChange={ev => setDeviceId(ev.target.value)}
                  fullWidth
                  label="Selecciona el usuario"
                  error={!!errors.userId}
                  helperText={errors.userId?.message}

                >
                  {categoriesUser.map((item) => (
                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} md={6}>
              <TextField
                id="color"
                label="Color"
                fullWidth
                error={!!errors.color}
                helperText={errors.color?.message}
                {
                ...register('color',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      value: /^[A-Z a-z áéíóú]+$/i,
                      message: 'No es un nombre de color valido.'
                    }
                  })
                }
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <TextField
                id="observations"
                label="Observaciones"
                fullWidth
                error={!!errors.observations}
                helperText={errors.observations?.message}
                {
                ...register('observations',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      value: /^[A-Z a-z áéíóú]+$/i,
                      message: 'No es un observacion valida.'
                    }
                  })
                }
              />
            </Grid>


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

export default ModalContentAddOrder;
