import * as React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import apiClient from '@/apiClient';

function CardOrder({index, order, onDelete, ruteDirection}) {  
  //almacenara los datos de las ordenes
  const [data, setData] = React.useState({...order});

  const handleDeleteOrder = () => {
    onDelete(index);
    apiClient.delete(`./api/orders?orderSelected=${data.id}`)
  }
  
  return (
    <Box>      
    <Card elevation={10} style={{ width: '100%', height: 'auto', marginBottom: '20px' }}>
      <CardContent>
        <Typography variant="h5" textAlign="center" fontWeight="normal" component="div">
          Cliente: {data.fullName}
        </Typography>

        <Typography variant="h5" textAlign="center" fontWeight="normal" component="div">
          Telefono: {data.phone}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Button variant="contained" >
            Editar
          </Button>
          <Button variant="contained"  onClick={handleDeleteOrder}>
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

export default CardOrder;