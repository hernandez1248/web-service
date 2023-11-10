import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Container, Grid, TextField, InputLabel, Select, FormControl, MenuItem, Input, InputAdornment, Alert } from '@mui/material';
import { useForm } from "react-hook-form";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apiClient from '@/apiClient';
import { useState, useEffect } from 'react';

const ModalContentAddDevice = ({ open, handleClose }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const [devicesId, setComponentId] = React.useState('');


  const [categories, setCategoriesDevice] = useState([]);


  const [categorySelected, setCategorieSelected] = useState(null);


  const onSubmit = (data) => {

    //enviar la informacion del formulario al backend
    apiClient.post('/api/device', data)
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

    apiClient.get('api/categories')
      .then(response => {
        setCategoriesDevice(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  return (

    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Registrar dispositivo</DialogTitle>


      <Container component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2} sx={{ marginBottom: 8 }}>


            <Grid item xs={12} md={6}>
              <TextField
                id="brand"
                label="Marca del dispositivo"
                fullWidth
                error={!!errors.brand}
                helperText={errors.brand?.message}
                {
                ...register('brand',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      value: /^[A-Z a-z áéíóú]+$/i,
                      message: 'No es un nombre de marca valida.'
                    }
                  })
                }
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <TextField
                id="model"
                label="Modelo del dispositivo"
                fullWidth
                error={!!errors.model}
                helperText={errors.model?.message}
                {
                ...register('model',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      value: /^[A-Z a-z áéíóú 0-9]+$/i,
                      message: 'No es un modelo valido.'
                    }
                  })
                }
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <FormControl sx={{ m: 0 }} fullWidth>
                <InputLabel id="demo-simple-select-autowidth-label">Selecciona la categoria del dispositivo</InputLabel>
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
                  label="Selecciona la categoria del dispositivo"
                  error={!!errors.deviceCategoryId}
                  helperText={errors.deviceCategoryId?.message}

                >
                  {categories.map((item) => (
                    <MenuItem key={item.id} value={item.id}>{item.type}</MenuItem>
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

export default ModalContentAddDevice;
