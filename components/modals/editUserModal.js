import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import apiClient from "@/apiClient";

function EditUserModal({ open, user, onClose, onUpdate }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [users, setUsers] = React.useState([]);

  const onSubmit = (data,) => {
    data.id = user.id;
    console.log("Usuario a actualizar:", user);
    apiClient.put(`/api/users?id=${user.id}`, data)
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
        console.log("Error al actualizar usuario:", error);
        Swal.fire({
          position: "center",
          icon: "error",
          text: error.response?.data?.message || 'Error al actualizar el usuario',
        });
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      method="post"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: 25,
          fontWeight: "bold",
        }}
      >
        Editar Usuario
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid container spacing={2} mt={0}>
            <Grid item xs={12}>
              <TextField
                id="name"
                label="Nombre"
                variant="outlined"
                fullWidth
                defaultValue={user.name}
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register("name", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g,
                    message: "El nombre solo debe contener letras",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="lastName"
                label="Apellido"
                variant="outlined"
                fullWidth
                defaultValue={user.lastName}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                {...register("lastName", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g,
                    message: "El apellido solo debe contener letras",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="phone"
                label="Teléfono"
                variant="outlined"
                fullWidth
                defaultValue={user.phone}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                {...register("phone", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Ingresa un número de teléfono válido (10 dígitos)",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="imagen"
                label="Imagen"
                variant="outlined"
                fullWidth
                defaultValue={user.image}
                error={!!errors.image}
                helperText={errors.image?.message}
                {...register("image", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^(https?|ftp|file):\/\/.+$/,
                    message: "La URL del avatar no es válida. Debe ser una URL completa",
                  },
                })}
              />
            </Grid>
            <Grid item xs={12}>
                <TextField
                  id="email"
                  label="Email"
                  variant="outlined"
                  fullWidth
                  defaultValue={user.email}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register("email", {
                    required: "El Email es Obligatorio",
                    pattern: {
                      value: /(.+)@(.+){2,}\.(.+){3,}/i,
                      message: "No es un email Válido",
                    },
                  })}
                />
              </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="rol">Rol</InputLabel>
                <Select
                  label="Rol"
                  defaultValue={user.rol}
                  id="rol"
                  name="rol"
                  error={!!errors.rol}
                  {...register("rol", {
                    required: "Este campo es obligatorio",
                  })}
                >
                  <MenuItem value="administrador">administrador</MenuItem>
                  <MenuItem value="empleado">empleado</MenuItem>
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
        <Button 
          onClick={onClose} 
          variant="contained"
          color="error"
        >
          <IconButton color="inherit">
            <CancelIcon />
          </IconButton>
          Cancelar
        </Button>
        <Button 
          variant="contained"
          color="primary"
          type="submit"
        >
          <IconButton color="inherit">
            <SaveIcon />
          </IconButton>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditUserModal;
