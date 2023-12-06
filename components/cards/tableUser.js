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
  Typography,
} from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import AddUser from "../modals/addUserModal";
import Swal from "sweetalert2";
import SearchIcon from "@mui/icons-material/Search";
import listUser from "./listUser";
import Pagination from "@mui/material/Pagination";
import ListUser from "./listUser";

const TableUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);

    const filtered = users.filter((user) => {
      const fullName = `${user.name} ${user.lastName}`.toLowerCase();
      const search = event.target.value.toLowerCase();
      return fullName.includes(search);
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };


  const loadUsers = () => {
    console.log('Se recargó');
    apiClient.get("/api/users")
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        setUsers(response.data || []);
        setFilteredUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateUser = (user) => {
    console.log(user);
    const usersCopy = [...users];
    const index = usersCopy.findIndex(item => item.id == user.id);
    console.log(index);
      usersCopy.splice(index, 1, user)
      setUsers([...usersCopy]);
      setFilteredUsers([...usersCopy]);
  }

  const renderUsers = () => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    return currentUsers.map((user) => (
      <ListUser
        user={user}
        onDelete={deleteUser}
        onSaved={loadUsers}
        onUpdate={updateUser}
        key={user.id}
      />
    ));
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const changePage = (event, newPage) => {
    setCurrentPage(newPage);
  };
  
  // Función para eliminar un usuario
  const deleteUser = (id) => {
    console.log("ID a eliminar:", id); 
    Swal.fire({
      title: "¿Estás Seguro de eliminar?",
      text: "Los datos relacionados con el usuario se perderán permanentemente",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, eliminar",
      
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Eliminar usuario con ID:", id); 
        apiClient.delete(`/api/users?id=${id}`)
          .then((response) => {
            console.log("Respuesta del servidor:", response.data);
            Swal.fire({
              position: "center",
              icon: "success",
              text: response.data.message,
              confirmButtonText: "Aceptar"
            });
            loadUsers();
          })
          .catch((error) => {
            console.log("Error al eliminar usuario:", error);
          });
      }
    });
  };

  return (
    <Box>
       {/*<Typography sx={{ display: "flex", justifyContent: "Center", fontSize: 25, fontWeight: 'bold',  }}>
          Usuarios
        </Typography>*/}
      <Paper>
        <Box sx={{ display: "flex", justifyContent: "flex-end"}}>
          <AddUser recharge={loadUsers}/>
        </Box>

        <Box sx={{ marginRight: "10px", marginLeft: "10px" }}>
        <TextField
          placeholder="Buscar usuario"
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
          <Table aria-label="User Table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>ID</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>NOMBRE</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>EMAIL</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>TELÉFONO</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>ROL</TableCell>
                <TableCell sx={{ color: '#223354', fontWeight: "800" }}>ACCIONES</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderUsers()}</TableBody>
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

export default TableUser;
