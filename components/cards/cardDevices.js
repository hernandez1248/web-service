import apiClient from "@/apiClient";
import {
  Box,
  Container,
  Grid,
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
import AddDevice from "../modals/addDeviceModal";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import ListDevice from "./listDevice";

const CardDevices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 8;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    const filtered = devices.filter((device) => {
      const model = `${device.model}`.toLowerCase();
      const search = event.target.value.toLowerCase();
      return model.includes(search);
    });

    setFilteredDevices(filtered);
    setCurrentPage(1);
  };


  const loadDevices = () => {
    console.log('Se recargó');
    apiClient.get("/api/device")
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setDevices(response.data || []);
        setFilteredDevices(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const updateDevice = (device) => {
    console.log(device);
    const devicesCopy = [...devices];
    const index = devicesCopy.findIndex(item => item.id == device.id);
    console.log(index);
    devicesCopy.splice(index, 1, device)
    setDevices([...devicesCopy]);
    setFilteredDevices([...devicesCopy]);
  }

  const renderDevices = () => {
    const indexOfLastDevice = currentPage * devicesPerPage;
    const indexOfFirstDevice = indexOfLastDevice - devicesPerPage;
    const currentDevices = filteredDevices.slice(indexOfFirstDevice, indexOfLastDevice);

    return currentDevices.map((device) => (
      <ListDevice
        device={device}
        onDelete={deleteDevice}
        onSaved={loadDevices}
        onUpdate={updateDevice}
        key={device.id}
      />
    ));
  };

  const totalPages = Math.ceil(filteredDevices.length / devicesPerPage);

  const changePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Función para eliminar un usuario
  const deleteDevice = (id) => {
    console.log("ID a eliminar:", id);
    Swal.fire({
      title: "¿Estás Seguro de eliminar?",
      text: "El dispositivo seleccionado se eliminara permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar",

    }).then((result) => {
      if (result.isConfirmed) {
        apiClient.delete(`/api/device?deviceSelected=${id}`)
          .then((response) => {
            console.log("Respuesta del servidor:", response.data);
            Swal.fire({
              position: "center",
              icon: "success",
              text: response.data.message,
              confirmButtonText: "Aceptar"
            });
            loadDevices();
          })
          .catch((error) => {
            console.log("Error al eliminar el dispositivo:", error);
          });
      }
    });
  };

  return (
    <Box>
      <Paper>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {<AddDevice recharge={loadDevices} />}
        </Box>

        <Box sx={{ marginRight: "10px", marginLeft: "10px",  marginBottom: '40px'}}>
          <TextField
            placeholder="Buscar dispositivo"
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
        <Container component={Paper}>
          <Grid container  justifyContent="inherit"  >
            {renderDevices()}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={changePage}
            />
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export default CardDevices;
