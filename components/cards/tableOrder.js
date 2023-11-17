import apiClient from "@/apiClient";
import {
  Box,
  InputAdornment,
  Paper,
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
import { useSession } from 'next-auth/react';

const TableOrder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    const filtered = orders.filter((order) => {
      const fullName = `${order.fullName}`.toLowerCase();
      const search = event.target.value.toLowerCase();
      return fullName.includes(search);
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };


  const loadOrders = () => {
    console.log('Se recargó');
    apiClient.get("/api/orders")
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setOrders(response.data || []);
        setFilteredOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrder = (order) => {
    console.log(order);
    const ordersCopy = [...orders];
    const index = ordersCopy.findIndex(item => item.id == order.id);
    console.log(index);
      ordersCopy.splice(index, 1, order)
      setOrders([...ordersCopy]);
      setFilteredOrders([...ordersCopy]);
  }

  const renderOrders = () => {
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

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
        apiClient.delete(`/api/orders?orderSelected=${id}`)
          .then((response) => {
            console.log("Respuesta del servidor:", response.data);
            Swal.fire({
              position: "center",
              icon: "success",
              text: response.data.message,
              confirmButtonText: "Aceptar"
            });
            loadOrders();
          })
          .catch((error) => {
            console.log("Error al eliminar orden:", error);
          });
      }
    });
  };

  const { data: session } = useSession();
  

  return (
    <Box>
      <Paper>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <AddOrder recharge={loadOrders}  user={session?.user} />
        </Box>

        <Box sx={{ marginRight: "10px", marginLeft: "10px" }}>
        <TextField
          placeholder="Buscar cliente"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange} 
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="Order Table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>ID</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>FECHA</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>CLIENTE</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>TELÉFONO</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>SERVICIO</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>GENERADA POR</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>ACCIONES</TableCell>
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
