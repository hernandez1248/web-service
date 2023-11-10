import * as React from 'react';
import { Button, Box, Card, CardContent, Typography } from '@mui/material';
import { useState } from 'react';
import { useEffect } from 'react';
import apiClient from '@/apiClient';
import ModalContentViewUpdateComponent from '../modals/viewUpdateComponent';
 

function CardComponent({index, component, onDelete, ruteDirection}) {  
  //almacenara los datos de los usuarios
  //const [components, setComponents] = useState([]);
  const [data, setData] = React.useState({...component});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  const handleDeleteComponent = () => {
    onDelete(index);
    apiClient.delete(`./api/components?id=${data.id}`)
  }

  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }
  

  return (
    <Box>
            
        <Card elevation={10} style={{ width: '100%', height: 'auto', marginBottom: '20px' }}>
          <CardContent>
            <Typography variant="h5" textAlign="center" fontWeight="normal" component="div">
              Componente: {data.name}
            </Typography>

            <Typography variant="h5" textAlign="center" fontWeight="normal" component="div">
              Stock: {data.stock}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Button variant="contained" onClick={handleOpenModal}>
                Ver(editar)
              </Button>
              <Button variant="contained" onClick={handleDeleteComponent}>
                Eliminar
              </Button>
              <Button variant="contained" href={ruteDirection}>
                Ver detalles
              </Button>
            </Box>
          </CardContent>

          

      <ModalContentViewUpdateComponent open={isModalOpen} handleClose={handleCloseModal} component={component} />
        </Card>
    </Box>


  );
}

export default CardComponent;