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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import apiClient from "@/apiClient";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";

function ListDetail({ onDeleteDetail, onUpdateDetails, details, setComponentList, componentList }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [detail, setDetails] = React.useState({ ...details });
  const [componentId, selectedComponentId] = React.useState('');
  const [editOrderDetailEdit, setEditOrderDetailEdit] = React.useState(false);
  const [selectedQuantity, setSelectedQuantity] = React.useState(1);
  //const [componentList, setComponentList] = React.useState([])

 
  const cancelEditOrderDetailEdit = () => {
    setEditOrderDetailEdit(false);
  }

  const handleEditDetail = (data) => {
    setEditOrderDetailEdit(!editOrderDetailEdit);
    setSelectedQuantity(detail.quantityComponent);
  }

  const handleDelete = () => {
    onDeleteDetail(detail.id);
  }

  const onSubmitOrderDetailEdit = () => { 
    
    const updatedDetails = {
      //...data,
      id: detail.id,
      ordersId: detail.ordersId,
      unitPrice: componentEditOrderDetail?.price,
      quantityComponent: selectedQuantity,
      amountTotal: totalPrice,
      //componenstId: detail.componentsId,
      componentsId: componentId || detail.componentsId,
      // Agregar otros campos que se hayan modificado
    };
    console.log(updatedDetails);
    apiClient.patch(`/api/orderDetails?id=${detail.id}`, updatedDetails)
    .then((response) => {
      console.log("Respuesta del servidor:", response.data);
      Swal.fire({
        position: "center",
        icon: "success",
        text: response.data.message,
        confirmButtonText: "Aceptar",
      });
      const swalContainer = document.querySelector(".swal2-container");

      // Establecer el zIndex directamente en el contenedor
      if (swalContainer) {
          swalContainer.style.zIndex = "9999";
      }
      
      setEditOrderDetailEdit(false);// Cierra el formulario/modal después de guardar los cambios
      onUpdateDetails();
    })
    .catch((error) => {
      console.log("Error al actualizar el detalle de orden:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        text: error.response?.data?.message || 'Error al actualizar el detalle de orden',
      });
      const swalContainer = document.querySelector(".swal2-container");

      // Establecer el zIndex directamente en el contenedor
      if (swalContainer) {
          swalContainer.style.zIndex = "9999";
      }
    });
  }

  




  const detailComponent = componentList.find(component => component.id === detail.componentsId);

  const componentEditOrderDetail = componentList.find(component => component.id === (componentId ||detail.componentsId));
  //const componentEditOrderDetail = componentList.find(component => component.id === componentId);
  //const totalPrice = componentEditOrderDetail?.price * selectedQuantity || 0;
  const totalPrice = componentEditOrderDetail?.price * selectedQuantity || 0;
  
  useEffect(() => {

  }, [detail,selectedQuantity, componentEditOrderDetail, componentEditOrderDetail, totalPrice,componentId, setDetails]);/////

  //console.log("///////////COMPONENTE////////////////");
  //console.log(componentList);
  //console.log(componentId);
  //console.log("COMPONENTE SELECCIONADO");
  //console.log(componentEditOrderDetail);


  React.useEffect(() => {
    setDetails({ ...details });
  }, [details]);



  return (
      
    <TableRow key={detail.id} >

      {!editOrderDetailEdit && (
        <>
          <TableCell>{detail.id}</TableCell>
          <TableCell>{detailComponent?.name}</TableCell>
          <TableCell>{detail.quantityComponent}</TableCell>
          <TableCell>{detail.unitPrice}</TableCell>
          <TableCell>{detail.amountTotal}</TableCell>
        </>
      )}

      {editOrderDetailEdit && (
        <>
          <TableCell>{detail.id}</TableCell>
          <TableCell>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-autowidth-label">Selecciona el componente</InputLabel>
              <Select
                id='componentsId'
                {
                ...register('componentsId',
                  {
                    required: '*Este campo es obligatorio.',
                  })
                }
                onChange={ev => selectedComponentId(ev.target.value)}
                fullWidth
                defaultValue={componentEditOrderDetail.id}
                label="Selecciona el componente"
                error={!!errors.componentsId}
                helperText={errors.componentsId?.message}

              >
                {componentList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </TableCell>
          <TableCell>
            <TextField
              id="quantityComponent"
              {
              ...register('quantityComponent',
                {
                  required: '*Este campo es obligatorio.',
                })
              }
              inputProps={{ min: 1, max: componentEditOrderDetail?.stock }}
              onChange={(event) => setSelectedQuantity(event.target.value)}
              label="Cantidad"
              fullWidth
              defaultValue={componentEditOrderDetail.quantityComponent}
              value={selectedQuantity}
              type="number"
              error={!!errors.quantityComponent}
              helperText={errors.quantityComponent?.message}
            />
          </TableCell>
          <TableCell>            
            <TextField value={componentEditOrderDetail?.price} disabled/>
          </TableCell>
          <TableCell>
            <TextField value={totalPrice}  disabled/>
          </TableCell>
        </>
      )}
      <TableCell>

        {!editOrderDetailEdit && (
          <>
            <IconButton
              aria-label="Editar"
              onClick={handleEditDetail}
              style={{ color: "blue" }}
              //type="submit"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="Eliminar"
              onClick={handleDelete}
              style={{ color: "red" }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
        {editOrderDetailEdit && (
          <>
            <IconButton
              aria-label="Guardar"
              onClick={onSubmitOrderDetailEdit}
              style={{ color: "blue" }}
              //type="submit"
            >
              <SaveIcon />
            </IconButton>
            <IconButton
              aria-label="Cancelar"
              onClick={cancelEditOrderDetailEdit}
              style={{ color: "red" }}
            >
              <CancelIcon />
            </IconButton>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}

export default ListDetail;
