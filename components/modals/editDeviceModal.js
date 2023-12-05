import React, { useState, useEffect } from "react";
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
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import apiClient from "@/apiClient";

function EditDeviceModal({ open, device, onClose, onUpdate }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [devicesId, setComponentId] = React.useState("");
  const [categories, setCategoriesDevice] = useState([]);

  const onSubmit = (data) => {
    data.id = device.id;
    apiClient
      .patch(`/api/device?id=${device.id}`, data)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        Swal.fire({
          position: "center",
          icon: "success",
          text: response.data.message,
          confirmButtonText: "Aceptar",
        });
        console.log(data);
        onClose();
        onUpdate(data);
        //reset();
      })
      .catch((error) => {
        console.log("Error al actualizar el dispositivo:", error);
        Swal.fire({
          position: "center",
          icon: "error",
          text:
            error.response?.data?.message ||
            "Error al actualizar el dispositivo",
        });
      });
  };

  useEffect(() => {
    apiClient
      .get("/api/categories")
      .then((response) => {
        setCategoriesDevice(response.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      method="patch"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "center",
          fontSize: 25,
          fontWeight: "bold",
        }}
      >
        Editar Dispositivo
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid container spacing={2} mt={0}>
            <Grid item xs={12} md={6}>
              <TextField
                id="brand"
                label="Marca del dispositivo"
                variant="outlined"
                fullWidth
                defaultValue={device.brand}
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
            <Grid item xs={12} md={6}>
              <TextField
                id="model"
                label="Modelo del dispositivo"
                variant="outlined"
                fullWidth
                defaultValue={device.model}
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
                defaultValue={device.image}
                error={!!errors.image}
                helperText={errors.image?.message}
                {...register("image", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^(https?|ftp|file):\/\/.+$/,
                    message:
                      "La URL de la imagen no es válida. Debe ser una URL completa",
                  },
                })}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl sx={{ m: 0 }} fullWidth>
                <InputLabel id="demo-simple-select-autowidth-label">
                  Categoria del dispositivo
                </InputLabel>
                <Select
                  id="deviceCategoryId"
                  {...register("deviceCategoryId", {
                    required: "*Este campo es obligatorio.",
                    pattern: {
                      message: "No es un dispositivo valido.",
                    },
                  })}
                  onChange={(ev) => setComponentId(ev.target.value)}
                  fullWidth
                  defaultValue={device.deviceCategoryId}
                  label="Categoria del dispositivo"
                  error={!!errors.deviceCategoryId}
                  helperText={errors.deviceCategoryId?.message}
                >
                  {categories.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.type}
                    </MenuItem>
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
        <Button onClick={onClose} variant="contained" color="error">
          <IconButton color="inherit">
            <CancelIcon />
          </IconButton>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" type="submit">
          <IconButton color="inherit">
            <SaveIcon />
          </IconButton>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditDeviceModal;
