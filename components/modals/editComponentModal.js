import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText,
  DialogActions, 
  Button, 
  Grid, 
  TextField, 
  InputLabel, 
  Select, 
  FormControl, 
  MenuItem, } from '@mui/material';
import { useForm } from "react-hook-form";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import apiClient from '@/apiClient';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EditComponentModal = ({ open, onClose, component, onUpdate }) => {

  // const [dataComponent, setDataComponent] = React.useState({ ...component });
  const [devicesId, setDeviceId] = React.useState('');
  const [devices, setDevices] = useState([]);

  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors },
    reset 
  } = useForm();


  const [categorySelected, setCategorieSelected] = useState(null);

  const onSubmit = (data) => {
    data.id = component.id;
    //enviar la informacion del formulario al backend
    apiClient.patch(`/api/components?id=${component.id}`, data)
    .then((response) => {
      console.log("Respuesta del servidor:", response.data);
      Swal.fire({
          position: "center",
          icon: "success",
          text: response.data.message,
          confirmButtonText: "Aceptar",
      })
        console.log(data);
        onClose();
        onUpdate(data);
        //reset();
    })
    .catch((error) => {
      console.log("Error al actualizar el componente:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        text: error.response?.data?.message || 'Error al actualizar el componente',
      });
    });
  };


  const onSelectCategory = (e) => {
    setCategorieSelected(e.target.value);
  }

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

    <Dialog 
        open={open}
        onClose={onClose}
        component={"form"}
        onSubmit={handleSubmit(onSubmit)}
        method="patch"
        >
        <DialogTitle
          sx={{
              display: "flex",
              justifyContent: "center",
              fontSize: 25,
          }}
      >
          Editar Componente
      </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description" sx={{ padding: 2 }}>
              <Grid container spacing={2} sx={{ marginBottom: 8 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="name"
                    variant="outlined"
                    label="Nombre del componente"
                    fullWidth
                    defaultValue={component.name}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    {
                    ...register('name',
                      {
                        required: '*Este campo es obligatorio.',
                        pattern: {
                          value: /^[A-Z a-z áéíóú 0-9.\-/]+$/i,
                          message: 'No es un nombre valido.'
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
                    defaultValue={component.price}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    {
                    ...register('price',
                      {
                        required: '*Este campo es obligatorio.',
                        pattern: {
                          value: /^[0-9]+(\.[0-9]+)?$/i,
                          message: 'No es un precio valido.'
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
                    defaultValue={component.stock}
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                    {
                    ...register('stock',
                      {
                        required: '*Este campo es obligatorio.',
                        pattern: {
                          value: /^[0-9]+(\.[0-9]+)?$/i,
                          message: 'No es un stock valido.'
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
                            message: 'No es un dispositivo valido.'
                          }
                        })
                      }
                      onChange={ev => setDeviceId(ev.target.value)}
                      fullWidth
                      defaultValue={component.deviceId}
                      label="Selecciona el dispositivo"
                      error={!!errors.deviceId}
                      helperText={errors.deviceId?.message}

                    >
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
                    defaultValue={component.image}
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
            <Button onClick={onClose} variant="contained" color="error">
              <HighlightOffIcon />
              Cancelar
            </Button>
            <Button type="submit" variant="contained"  >
              <SaveOutlinedIcon />
               Guardar
            </Button>
          </DialogActions>

          <style jsx>
            {`
              .cancel{
                color: #FFFFFF;
                text-decoration: none;
              }`
            }
          </style>
      </Dialog>
  );
};

export default EditComponentModal;
