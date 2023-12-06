import apiClient from "@/apiClient";
import {
  Box,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import AddOrder from "../modals/addOrderModal";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import ListOrder from "./listOrder";
import { useSession } from "next-auth/react";

const TableOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const [service, setService] = useState([
    { id: 1, name: "Mantenimiento" },
    { id: 2, name: "Reparacion" },
  ]);
  const [state, setStates] = useState([
    { id: 1, name: "Registrada" },
    { id: 2, name: "Pendiente" },
    { id: 3, name: "Completada" },
  ]);

  const [selectServiceType, setSelectServiceType] = useState("fullOrders");
  const [selectStatusType, setSelectStatusType] = useState("fullOrders");

  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedStatusId, setSelectedStatusId] = useState(null);

  const { data: session } = useSession();

  let userLogueado = session?.user?.id;
  let rolUserLogueado = session?.user?.rol;

  const handleServiceChange = (event) => {
    const servicesId = event.target.value;
    setSelectServiceType(servicesId);
    setSelectedServiceId(servicesId === "fullOrders" ? null : servicesId);
    setSearchTerm("");
  };

  const handleStatesChange = (event) => {
    const status = event.target.value;
    setSelectStatusType(status);
    setSelectedStatusId(status === "fullOrders" ? null : status);
    setSearchTerm("");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    const filtered = orders.filter((order) => {
      const fullName = `${order.fullName}`.toLowerCase();
      const search = event.target.value.toLowerCase();

      const orderMatch =
        selectedServiceId === null || order.servicesId === selectedServiceId;

      const orderStatusMatch = selectedStatusId === null;

      return orderStatusMatch && orderMatch && fullName.includes(search);
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  if (rolUserLogueado === "administrador") {
    userLogueado = undefined;
  } else if (rolUserLogueado === "empleado") {
    userLogueado = session?.user?.id;
  }

  const loadOrders = () => {
    console.log("Se recargó");
    const queryParams = {
      servicesId: selectedServiceId || undefined,
      status: selectedStatusId || undefined,
      userId: userLogueado, //2,//selectedUserId || undefined,
      fullName: searchTerm || undefined,
    };

    apiClient
      .get("/api/orders", { params: queryParams })
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setOrders(response.data || []);
        setFilteredOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    apiClient
      .get("/api/users")
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setUserOrders(response.data || []);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadOrders();
  }, [userLogueado, rolUserLogueado]);

  useEffect(() => {
    if (
      selectServiceType !== null ||
      selectStatusType !== null ||
      searchTerm !== ""
    ) {
      loadOrders();
    }
  }, [selectServiceType, selectStatusType, searchTerm]);

  const updateOrder = (order) => {
    console.log(order);
    const ordersCopy = [...orders];
    const index = ordersCopy.findIndex((item) => item.id == order.id);
    console.log(index);
    ordersCopy.splice(index, 1, order);
    setOrders([...ordersCopy]);
    setFilteredOrders([...ordersCopy]);
  };

  const renderOrders = () => {
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(
      indexOfFirstOrder,
      indexOfLastOrder
    );

    return currentOrders.map((order) => (
      <ListOrder
        order={order}
        onDelete={deleteOrder}
        onSaved={loadOrders}
        onUpdate={updateOrder}
        key={order.id}
      />
    ));
  };

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const changePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Función para eliminar un usuario
  const deleteOrder = (id) => {
    console.log("ID a eliminar:", id);
    Swal.fire({
      title: "¿Estás Seguro de eliminar?",
      text: "Los datos relacionados con esta orden se perderán permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        apiClient
          .delete(`/api/orders?orderSelected=${id}`)
          .then((response) => {
            console.log("Respuesta del servidor:", response.data);
            Swal.fire({
              position: "center",
              icon: "success",
              text: response.data.message,
              confirmButtonText: "Aceptar",
            });
            loadOrders();
          })
          .catch((error) => {
            console.log("Error al eliminar orden:", error);
          });
      }
    });
  };

  return (
    <Box>
      <Paper>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <AddOrder recharge={loadOrders} user={session?.user} />
        </Box>

        <Grid
          container
          spacing={2}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Grid item xs={12} md={6}>
            <TextField
              sx={{ marginRight: "10px", marginLeft: "10px" }}
              placeholder="Buscar cliente"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="device-id">Tipo de servicio</InputLabel>
              <Select
                sx={{ marginRight: "10px", marginLeft: "10px" }}
                id="device-id"
                label="Tipo de servicio"
                value={selectServiceType}
                onChange={handleServiceChange}
                //value={selectServiceType}
                //onChange={handleServiceChange}
              >
                <MenuItem value="">Todos</MenuItem>

                {service.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.id}
                  >{`${item.name}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="device-id">Status</InputLabel>
              <Select
                sx={{ marginRight: "10px", marginLeft: "10px" }}
                id="device-id"
                variant="outlined"
                fullWidth
                label="Status"
                value={selectStatusType}
                onChange={handleStatesChange}
                //value={selectServiceType}
                //onChange={handleServiceChange}
              >
                <MenuItem value="">Todos</MenuItem>

                {state.map((item) => (
                  <MenuItem
                    key={item.id}
                    value={item.name}
                  >{`${item.name}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table aria-label="Order Table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#223354", fontWeight: "800" }}>
                  ID
                </TableCell>
                <TableCell sx={{ color: "#223354", fontWeight: "800" }}>
                  FECHA
                </TableCell>
                <TableCell sx={{ color: "#223354", fontWeight: "800" }}>
                  CLIENTE
                </TableCell>
                <TableCell sx={{ color: "#223354", fontWeight: "800" }}>
                  TELÉFONO
                </TableCell>
                <TableCell sx={{ color: "#223354", fontWeight: "800" }}>
                  SERVICIO
                </TableCell>
                <TableCell sx={{ color: "#223354", fontWeight: "800" }}>
                  GENERADA POR
                </TableCell>
                <TableCell sx={{ color: "#223354", fontWeight: "800" }}>
                  ACCIONES
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderOrders()}</TableBody>
          </Table>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={changePage}
            />
          </Box>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TableOrder;
