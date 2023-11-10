import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Container, Grid, TextField, InputLabel, Select, FormControl, MenuItem, Input, InputAdornment, Alert } from '@mui/material';
import { useForm } from "react-hook-form";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apiClient from '@/apiClient';
import { useState, useEffect } from 'react';

const ModalContentAddComponent = ({ open, handleClose }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const [devicesId, setDeviceId] = React.useState('');


  const [categories, setCategoriesDevice] = useState([]);


  const [categorySelected, setCategorieSelected] = useState(null);


  const onSubmit = (data) => {

    //enviar la informacion del formulario al backend
    apiClient.post('/api/components', data)
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


  const onSelectCategory = (e) => {
    setCategorieSelected(e.target.value);
  }

  useEffect(() => {
    /*Ir por los productos desde el backend */

    apiClient.get('api/device')
      .then(response => {
        setCategoriesDevice(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  return (

    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Registrar componente</DialogTitle>


      <Container component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginBottom: 8 }}>


            <Grid item xs={12} md={6}>
              <TextField
                id="name"
                label="Nombre del componente"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                {
                ...register('name',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      value: /^[A-Z a-z áéíóú 0-9]+$/i,
                      message: 'No es un nombre valido.'
                    }
                  })
                }
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <TextField label="Precio" fullWidth
                id="price"
                error={!!errors.price}
                helperText={errors.price?.message}
                {
                ...register('price',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      value: /^[0-9]+$/i,
                      message: 'No es un precio valido.'
                    }
                  })
                }
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField label="Stock" fullWidth
                id="stock"
                error={!!errors.stock}
                helperText={errors.stock?.message}
                {
                ...register('stock',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      value: /^[0-9]+$/i,
                      message: 'No es un stock valido.'
                    }
                  })
                }
              />
            </Grid>
            {/*<Grid item xs={12} md={6}>
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
                  <MenuItem id="deviceId" value={1}>Fantasia</MenuItem>
                  <MenuItem value={2}>Aventura</MenuItem>
                  <MenuItem value={3}>Terror</MenuItem>
                  <MenuItem value={4}>Comedia</MenuItem>
                  <MenuItem value={5}>Rmantica</MenuItem>
                </Select>
              </FormControl>
            </Grid>*/}


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
                  {categories.map((item) => (
                    <MenuItem key={item.id} value={item.id}>{item.model}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export default ModalContentAddComponent;
