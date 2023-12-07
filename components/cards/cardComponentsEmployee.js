import * as React from 'react';
import { useEffect } from 'react';
import apiClient from '@/apiClient';
import {  Box, Container, Grid, Paper, TextField, FormControl, InputAdornment, MenuItem, InputLabel, Select } from '@mui/material';
import { useState } from 'react';
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import ListComponentsEmployee from './listComponentEmployee';
import ModalContentAddComponent from '../modals/addComponents';


const CardComponentEmployee = () => {  
  //almacenara los datos de los usuarios
  const [components, setComponents] = useState([]);
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [devices, setDevices] = useState([]);
  const [deviceSelected, setDeviceSelected] = useState('todosDevices');
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const componentsPerPage = 4;

  const handleDeviceChange = (event) => {
    const deviceId = event.target.value;
    setDeviceSelected(deviceId);
    setSelectedDeviceId(deviceId === 'todosDevices' ? null : deviceId);
    setSearchTerm(""); 
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    const filtered = components.filter((component) => {
      const name = `${component.name}`.toLowerCase();
      const search = searchTerm.toLowerCase();

      const deviceMatch = selectedDeviceId === null || component.deviceId === selectedDeviceId;

      return deviceMatch && name.includes(search);
    });

    setFilteredComponents(filtered);
    setCurrentPage(1);
  };
  
  const loadComponents = () => {
    console.log('Se recargó');

    const queryParams = {
      deviceId: selectedDeviceId || undefined,
      name: searchTerm || undefined,
    };

    apiClient.get("/api/components", { params: queryParams })
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setComponents(response.data || []);
        setFilteredComponents(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    
    apiClient.get("/api/device")
      .then((response) => {
        console.log("Lista de dispositivos:", response.data);
        setDevices(response.data || []);
      })
      .catch((error) => {
        console.log("Error al obtener la lista de dispositivos:", error);
    });
  };


  useEffect(() => {
    loadComponents();
  }, []);

  useEffect(() => {
    if (deviceSelected !== null || searchTerm !== "") {
      loadComponents();
    }
  }, [deviceSelected, searchTerm]);
  


  const updateComponent = (component) => {
    console.log(component);
    const componentsCopy = [...components];
    const index = componentsCopy.findIndex(item => item.id == component.id);
    console.log(index);
    componentsCopy.splice(index, 1, component)
    setComponents([...componentsCopy]);
    setFilteredComponents([...componentsCopy]);
  }

  const renderComponents = () => {
    const indexOfLastComponent = currentPage * componentsPerPage;
    const indexOfFirstComponent = indexOfLastComponent - componentsPerPage;
    const currentComponents = filteredComponents.slice(indexOfFirstComponent, indexOfLastComponent);

    return currentComponents.map((component) => (
      <ListComponentsEmployee
        component={component}
        onDelete={deleteComponent}
        onSaved={loadComponents}
        onUpdate={updateComponent}
        key={component.id}
      />
    ));
  };

  const totalPages = Math.ceil(filteredComponents.length / componentsPerPage);

  const deleteComponent = (id) => {
    console.log("ID a eliminar:", id);
    Swal.fire({
      title: "¿Estás seguro de eliminar?",
      text: "El componente seleccionado se eliminará permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar",

    }).then((result) => {
      if (result.isConfirmed) {
        apiClient.delete(`/api/components?id=${id}`)
          .then((response) => {
            console.log("Respuesta del servidor:", response.data);
            Swal.fire({
              position: "center",
              icon: "success",
              text: response.data.message,
              confirmButtonText: "Aceptar",
            });
            loadComponents();
          })
          .catch((error) => {
            console.log("Error al eliminar el componente:", error);
          });
      }
    });
  };

  const changePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Box>
      <Paper>
        <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center'}}>
        <Grid item xs={12} md={6} spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="device-id">Dispositivo</InputLabel>
                <Select 
                  id="device-id" 
                  label="Dispositivo"
                  value={deviceSelected}
                  onChange={handleDeviceChange}
                >
                <MenuItem value="todosDevices">Todos</MenuItem>
                  {devices.map((item) => (
                <MenuItem key={item.id} value={item.id}>{`${item.brand} ${item.model}`}</MenuItem>
                  ))}
                </Select>
            </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            placeholder="Buscar componente"
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
        </Grid>
        <Container component={Paper} >
          <Grid container  justifyContent="inherit" sx={{ display: 'flex', margin: '25px'}} >
            {renderComponents()}
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
}

export default CardComponentEmployee;
