import * as React from 'react';
import { Card, Typography } from '@mui/material';


function CardCronoUser({ crono}) {
  const [data, setData] = React.useState({ ...crono });
  
  return (
    <Card elevation={10} style={{ width: '100%', height: 'auto' }} className="cardCronograma cards">
          <Typography
            gutterBottom
            variant="h5"
            textAlign="center"
            mt={2}
            fontWeight="bold"
            component="div">
            Unidad: {data.name || ""}
          </Typography>

          <div className="cardCronogramaInfo">
            <div className="cardCronogramaDatosIzq">
              Salida:
            </div>
            <div className="cardCronogramaDatosDer">
              {data.lastName}
            </div>
          </div>
          <div className="cardCronogramaInfo" style={{marginBottom: '20px'}}>
            <div className="cardCronogramaDatosIzq">
              Chofer:
            </div>
            <div className="cardCronogramaDatosDer">
              {data.unit.name || ""}
            </div>
          </div>
    </Card>
  );
}

export default CardCronoUser;