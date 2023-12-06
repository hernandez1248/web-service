import apiClient from "@/apiClient";
import {
  Box,
  Container,
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
import AddDevice from "../modals/addDeviceModal";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import ListDevice from "./listDevice";

const CardDevices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [devices, setDevices] = useState([]);

  const [categorydevices, setCategoryDevices] = useState([]);
  const [categorydeviceSelected, setCategoryDeviceSelected] = useState('todosDevices');
  const [selectedCategoryDeviceId, setSelectedCategoryDeviceId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const devicesPerPage = 8;

  const handleCategoryDeviceChange = (event) => {
    const categoryDeviceId = event.target.value;
    setCategoryDeviceSelected(categoryDeviceId);
    setSelectedCategoryDeviceId(categoryDeviceId === 'todosDevices' ? null : categoryDeviceId);
    setSearchTerm("");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    const filtered = devices.filter((device) => {
      const model = `${device.brand}`.toLowerCase();
      const search = event.target.value.toLowerCase();
      const categoryDeviceMatch = selectedCategoryDeviceId === null || device.deviceCategoryId === selectedCategoryDeviceId;

      return categoryDeviceMatch && model.includes(search);
    });

    setFilteredDevices(filtered);
    setCurrentPage(1);
  };


  const loadDevices = () => {
    console.log('Se recargó');

    const queryParams = {
      deviceCategoryId: selectedCategoryDeviceId || undefined,
      brand: searchTerm || undefined,
    };

    apiClient.get("/api/device", { params: queryParams })
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setDevices(response.data || []);
        setFilteredDevices(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    apiClient.get("/api/categories")
      .then((response) => {
        console.log("categorias:", response.data);
        setCategoryDevices(response.data || []);
      })
      .catch((error) => {
        console.log("Error al obtener las categorias:", error);
      });


  };

  useEffect(() => {
    loadDevices();
  }, []);


  useEffect(() => {
    if (categorydeviceSelected !== null || searchTerm !== "") {
      loadDevices();
    }
  }, [categorydeviceSelected, searchTerm]);


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

        <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>

          <Grid item xs={12} md={6}>
            <TextField
              sx={{ marginRight: "10px", marginLeft: "10px" }}
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
          </Grid>

          <Grid item xs={12} md={6} spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="categoryDevice-id">Categoria</InputLabel>
              <Select
                sx={{ marginRight: "10px", marginLeft: "10px" }}
                id="categoryDevice-id"
                label="Categoria"
                value={categorydeviceSelected}
                onChange={handleCategoryDeviceChange}
              >
                <MenuItem value="todosDevices">Todos</MenuItem>
                {categorydevices.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{`${item.type}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Container component={Paper}>
          <Grid container justifyContent="inherit"  >
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
