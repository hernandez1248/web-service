import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { useState } from "react";
import apiClient from "@/apiClient";
import CardDevices from "@/components/cards/cardDevices";
import ModalContentAddDevice from "@/components/modals/addDevices";

const DevicesView = () => {

  const [devices, setDevices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteDevice = (index) => {
      //Clonar Devices
      const devicesCopy = [...devices];
      devicesCopy.splice(index,1);
      //Actualizar el estado devices con la nueva lista
      setDevices(devicesCopy);

  }
  useEffect(() => {
    apiClient.get("./api/device")
      .then((response) => {
        setDevices(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de los dispositivos:", error);
      });
  }, []);
  console.log(devices);
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }
  const renderDevices = () => {
     return devices.map( (device, index) => (
       <Grid item xs={12} lg={4} xl={12} key={device.id}>
       <CardDevices
       index = {index}
       device = {device}
       onDelete = {deleteDevice}         
       ruteDirection = {`/devices/${device.id}`}
      />   
     </Grid>
     ))
 };
  return (
    <Box> 
      <div>
        Hola, aqui va la interfaz de Dispositivos
      </div>
      <Button onClick={handleOpenModal}>Agregar dispositivo</Button>
      
      
      <Grid container spacing={2}>
          {renderDevices()}
      </Grid>

      <ModalContentAddDevice open={isModalOpen} handleClose={handleCloseModal} />
    </Box>
  )
}

export default DevicesView;