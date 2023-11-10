import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { useState } from "react";
import apiClient from "@/apiClient";
import CardComponent from "@/components/cards/cardComponents";
import ModalContentAddComponent from "@/components/modals/addComponents";

const ComponentsView = () => {

  const [components, setComponents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteComponent = (index) => {
      //Clonar Components
      const componentsCopy = [...components];
      componentsCopy.splice(index,1);
      //Actualizar el estado components con la nueva lista
      setComponents(componentsCopy);

  }
  useEffect(() => {
    apiClient.get("./api/components")
      .then((response) => {
        setComponents(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de los usuarios:", error);
      });
  }, []);
  console.log(components);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }
  
  const renderComponent = () => {
     return components.map( (component, index) => (
       <Grid item xs={12} lg={4} xl={12} key={component.id}>
       <CardComponent
       index = {index}
       component = {component}
       onDelete = {deleteComponent}         
       ruteDirection = {`/components/${component.id}`}
      />   
     </Grid>
     ))
 };
  return (
    <Box>
      <div>
        Hola, aqui va la interfaz de Componentes
      </div>

      <Button onClick={handleOpenModal}>Agregar componente</Button>


      
      <Grid container spacing={2}>
          {renderComponent()}
      </Grid>

      <ModalContentAddComponent open={isModalOpen} handleClose={handleCloseModal} />
    </Box>
  )
}

export default ComponentsView;