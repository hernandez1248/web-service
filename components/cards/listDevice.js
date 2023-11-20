import * as React from "react";
import { Card, CardContent, Typography, Button, Box, Tooltip, Avatar, CardMedia } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditDeviceModal from "../modals/editDeviceModal";

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

function ListDevice({ device, onDelete, onUpdate }) {
  const [data, setData] = React.useState({ ...device });
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
    setData({ ...device });
  }, [device]);

  return (
    <>
    <Card elevation={10} sx={{ maxWidth: 300, maxHeight: 430, marginBottom: '30px'}} style={{ width: '250px', height: '500px', marginBottom: '40px', marginLeft: '30px'}}>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <CardMedia component="img" height="240" image={data.image} alt={data.brand} />
          <Typography variant="h5" textAlign="justify" fontWeight="normal" component="div" sx={{ display: 'flex', alignItems: 'center', height: '50px' }}>
            {truncateText(data.brand, 15)}
          </Typography>
          <Typography variant="h5" textAlign="justify" fontWeight="normal" component="div" sx={{ display: 'flex', alignItems: 'center', height: '50px' }}>
            {truncateText(data.model, 15)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" marginTop="15px" marginBottom="20px">
          <Tooltip>
            <Button
              variant="contained"
              onClick={handleEdit}
              startIcon={<EditIcon />}              
              style={{ marginRight: '8px' }}
            >
              Editar
            </Button>
          </Tooltip>
          <Tooltip>
            <Button
              variant="contained"
              onClick={handleDelete}
              startIcon={<DeleteIcon />}
              style={{ backgroundColor: "#f44336", color: "#fff", marginRight: '8px'}}
            >
              Eliminar
            </Button>
          </Tooltip>
        </Box>
      </CardContent>
      <EditDeviceModal
        open={edit}
        device={data}
        onClose={cancelEdit}
        onUpdate={onUpdate}
      />
    </Card>
  </>
  );
}

export default ListDevice;
