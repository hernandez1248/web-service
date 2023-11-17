import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card, CardActions, CardContent, Typography, Button, Box, CardMedia, Grid, Chip  } from "@mui/material";
import EditComponentModal from "../modals/editComponentModal";
import WarningIcon from "@mui/icons-material/Warning";


const getStockColor = (stock) => {
  return stock < 10
    ? "red"
    : stock > 10
    ? "rgb(29, 116, 222)"
    : "inherit";
};

const CustomTableCell = styled(Typography)(({ stock }) => ({
  color: getStockColor(stock),
  padding: 0,
  position: 'relative',
}));

const StockText = styled("span")(({ stock }) => ({
  backgroundColor:
    stock < 10 ? "rgba(255, 25, 67, 0.1)" : "rgba(29, 116, 222, 0.1)",
  color: getStockColor(stock),
  borderRadius: "30px",
  padding: "5px 10px",
  fontWeight: "800"
}));


const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

function ListComponents({ component, onDelete, onUpdate }) {

  const [data, setData] = React.useState({ ...component });
  const [edit, setEdit] = React.useState(false);

  const handleEdit = () => {
    setEdit(true);
  }

  const cancelEdit = () => {
    setEdit(false);
  }

  const handleDelete = () => {
    onDelete(data.id);
  }

  React.useEffect(() => {
    setData({ ...component });
  }, [component]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '50px', marginLeft: '25px', justifyContent: 'center' }}>
      <Card elevation={3} sx={{ maxWidth: '100%', marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CardMedia component="img" height="200" width="100%" image={data.image} alt={data.name} />
        <CardContent sx={{ padding: '16px', textAlign: 'center' }}>
          <Typography variant="h6" className='nameBook'>
            {data.name}
          </Typography>
          <Grid container spacing={1} justifyContent="space-between" alignItems="center">
            <Grid item xs={12}>
              <Chip color='success' fontWeight="normal" sx={{ fontWeight: '600' }} label={`$${data.price}`} />
            </Grid>
            <Grid item xs={12} sx={{marginTop: '20px', textAlign: 'right' }}>
              <Typography fontWeight="normal" component="div">
                <CustomTableCell stock={data.stock} variant="h9">
                  Disponible: 
                  <StockText stock={data.stock}>{Math.round(data.stock)}</StockText>
                </CustomTableCell>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', padding: '16px' }}>
          <Button size="small" onClick={handleEdit}><EditIcon /></Button>
          <Button size="small" color="error" onClick={handleDelete}><DeleteIcon /></Button>
        </CardActions>
          <EditComponentModal
            open={edit}
            component={data}
            onClose={cancelEdit}
            onUpdate={onUpdate}
          />
      </Card>
    </Box>   
  )
}

export default ListComponents;



