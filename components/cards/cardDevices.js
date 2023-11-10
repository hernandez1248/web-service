import * as React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import apiClient from '@/apiClient';


function CardDevices({index, device, onDelete, ruteDirection}) {  
  //almacenara los datos de los dispositivos
  const [data, setData] = React.useState({...device});




  const handleDeleteDevice = () => {
    onDelete(index);
    apiClient.delete(`./api/device?deviceSelected=${data.id}`)
  }
  
  
  return (
    <Box>
      
    <Card elevation={10} style={{ width: '100%', height: 'auto', marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5" textAlign="center" fontWeight="normal" component="div">
          Marca: {data.brand}
        </Typography>

        <Typography variant="h5" textAlign="center" fontWeight="normal" component="div">
          Modelo: {data.model}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" >
            Editar
          </Button>
          <Button variant="contained"  onClick={handleDeleteDevice}>
            Eliminar
          </Button>
          <Button variant="contained"  href={ruteDirection}>
            Ver detalles
          </Button>
        </Box>
      </CardContent>
    </Card>
    </Box>


  );
}

export default CardDevices;