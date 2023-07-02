import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import apiClient from 'apiClient';

const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
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

  const onSubmit = (data) => {
    const datosFormulario = {
      ...data,
      detalles,
    };

    apiClient.post('/api/orders', datosFormulario)
      .then((response) => {
        alert(response.data.message);
      })
      .catch((error) => {
        alert(error.response.data.message);

        if (error.response.data.errors) {
          error.response.data.errors.forEach((errorItem) => {
            setError(errorItem.field, {
              type: "validation",
              message: errorItem.error
            });
          });
        }
      });
  };

  return (
    // Resto del código del componente...

    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Campos existentes... */}
      <TextField
            margin="normal"
            label="Nombre completo"
            id="fullName"
            fullWidth
            {
              ...register('fullName',
              {
                  required: '*Este campo es obligatorio.',
                  pattern: {
                      value: /^[A-Z a-z áéíóú]+$/i,
                      message: 'No es un nombre de usuario valido.'
                  }
              })
            } 
          />


      {/* Campos de detalle de compra */}
      {detalles.map((detalle, index) => (
        <div key={index}>

          <TextField
            margin="normal"
            label="Producto ID"
            fullWidth
            value={detalle.componentsId || ''}
            onChange={(e) => handleDetalleChange(e, index, 'componentsId')}
          />

          <TextField
            margin="normal"
            label="Cantidad de componentes"
            fullWidth
            value={detalle.quantityComponent || ''}
            onChange={(e) => handleDetalleChange(e, index, 'quantityComponent')}
          />

          <TextField
            margin="normal"
            label="Precio Unitario"
            fullWidth
            value={detalle.unitPrice || ''}
            onChange={(e) => handleDetalleChange(e, index, 'unitPrice')}
          />
        </div>
      ))}

      <Button type="button" onClick={agregarDetalle} fullWidth>
        Agregar Detalle
      </Button>

      <Button type="submit"  fullWidth>
        Guardar
      </Button>

      {/* Resto del código del formulario... */}
    </Box>
    
  );
};

export default RegisterPage;
