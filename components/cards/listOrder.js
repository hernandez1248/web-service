import * as React from "react";
import { TableRow, TableCell, IconButton, styled, Avatar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import apiClient from "@/apiClient";
import ViewSingleOrderModal from "../modals/viewSingleOrder";


const getRolColor = (rol) => {
  return rol === "administrador"
    ? "red"
    : rol === "empleado"
      ? "rgb(51, 194, 255)"
      : "inherit";
};

const CustomTableCell = styled(TableCell)(({ rol }) => ({
  color: getRolColor(rol),
  padding: 0,
}));

const RolText = styled("span")(({ rol }) => ({
  backgroundColor:
    rol === "administrador" ? "rgba(255, 25, 67, 0.1)" : "rgba(51, 194, 255, 0.1)",
  color: getRolColor(rol),
  borderRadius: "30px",
  padding: "5px 10px",
  fontWeight: "800"
}));


function ListOrder({ order, onDelete, onUpdate, onSaved }) {
  const [data, setData] = React.useState({ ...order });
  const [edit, setEdit] = React.useState(false);
  const [view, setView] = React.useState(false);
  const [devices, setDevice] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [orderDetails, setOrderdetails] = React.useState([]);

  const [usersFilter, setUsersFilter] = React.useState([]);

  const handleView = () => {
    setView(true);
  }

  const cancelView = () => {
    setView(false);
  }

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
    setData({ ...order });
  }, [order]);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const loadStatesOrder = () => {
    console.log('Se recargó');
    //apiClient.get(`/api/states?ordersId=${data.id}`)
    apiClient.get(`/api/states`)
      .then(response => {
        setStates(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const loadOrderDetails = () => {
    apiClient.get(`/api/orderDetails`)
      .then(response => {
        setOrderdetails(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });
  }


  React.useEffect(() => {

    apiClient.get(`/api/users?userId=${data.userId}`)
      .then(response => {
        setUsersFilter(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });

    //apiClient.get(`/api/device?deviceId=${data.deviceId}`)
    apiClient.get(`/api/device`)
      .then(response => {
        setDevice(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });



    loadOrderDetails();
    loadStatesOrder();

  }, []);

  const ordersId = data.id
  const deviceId = data.deviceId
  const orderState = states.find(state => state.ordersId === ordersId);
  const orderDevice = devices.find(device => device.id === deviceId);
  //const details = orderDetails.find(details => details.ordersId === ordersId);
  const details = orderDetails.filter(detail => detail.ordersId === ordersId);



  return (
    <TableRow key={data.id}>

      <TableCell>{data.id}</TableCell>
      <TableCell>
        {/* aqui se Muestra solo la fecha */}
        {formatDate(data.date)}
      </TableCell>
      <TableCell>{data.fullName}</TableCell>
      <TableCell>{data.phone}</TableCell>
      <TableCell>
        {
          data.servicesId === 1 ? (
            "Mantenimiento"
          ) : data.servicesId === 2 ? (
            "Reparacion"
          ) : (
            ""
          )
        }
      </TableCell>
      {/*      <TableCell>
        {usersFilter.users && usersFilter.users && usersFilter.users.map(item => item.name)}
      </TableCell>*/}

      <TableCell>
        {usersFilter.users && usersFilter.users.map(user => (
          <span key={user.id}>{`${user.name} ${user.lastName}`}</span>
        ))}

      </TableCell>
      <TableCell>

        <IconButton
          aria-label="Ver detalles"
          style={{ color: "green" }}

          onClick={handleView}
        >
          <RemoveRedEyeIcon />
        </IconButton>

        <IconButton
          aria-label="Eliminar"
          onClick={handleDelete}
          style={{ color: "red" }}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>

      <ViewSingleOrderModal
        open={view}
        order={data}
        onClose={cancelView}
        onUpdate={onUpdate}
        devices={orderDevice}
        states={orderState}
        details={details}
        userGenerateOrder={usersFilter}
        recharge={loadStatesOrder}
        rechargeDetails={loadOrderDetails}
        edit={edit}
        onSaved={onSaved}
      />

      {/*<EditUserModal
        open={edit}
        order={data}
        onClose={cancelEdit}
        onUpdate={onUpdate}
  />*/}
    </TableRow>
  );
}

export default ListOrder;
