import React from "react";
import {
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  CardMedia,
} from "@mui/material";
import { Assignment, Devices, Settings } from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useRouter } from "next/router";

function Home({ user }) {
  const router = useRouter();
  const handleLoginClick = () => {
    // Redirige a la página de login
    router.push('/login');
  };
  return (
    <Paper>
      <Typography
        sx={{
          fontSize: 35,
          display: "flex",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        SmartDeviceSolutions
      </Typography>

      <Typography
        sx={{
          marginTop: 1,
          fontSize: 20,
          display: "flex",
          justifyContent: "center",
        }}
      >
        Generador de órdenes para mantenimiento y reparación de dispositivos
      </Typography>

      <List
        className="horizontal-list"
        sx={{
          display: "flex",
          justifyContent: "center",
          marginLeft: 20,
          padding: 0,
        }}
      >
        <ListItem className="horizontal-list-item">
          <ListItemAvatar>
            <Avatar
              src="https://w7.pngwing.com/pngs/602/747/png-transparent-computer-icons-name-that-rose-smartphone-mobile-phones-business-smartphone-electronics-telephone-call-rectangle.png"
              style={{ width: 55, height: 55 }}
            />
          </ListItemAvatar>
          <ListItemText
            primary="Celulares"
            primaryTypographyProps={{
              sx: { fontWeight: "bold", fontSize: 20 },
            }}
          />
        </ListItem>
        <ListItem className="horizontal-list-item">
          <ListItemAvatar>
            <Avatar
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA7b20uQmFEPGmfV7vOlTJloAUa9_kkkdJYQ&usqp=CAU"
              style={{ width: 48, height: 48 }}
            />
          </ListItemAvatar>
          <ListItemText
            primary="Tabletas"
            primaryTypographyProps={{
              sx: { fontWeight: "bold", fontSize: 20 },
            }}
          />
        </ListItem>
        <ListItem className="horizontal-list-item">
          <ListItemAvatar>
            <Avatar
              src="https://images.vexels.com/media/users/3/131217/isolated/preview/e613fbde0ac88fd305dee8929b6679f1-icono-de-circulo-de-portatil.png"
              style={{ width: 70, height: 70 }}
            />
          </ListItemAvatar>
          <ListItemText
            primary="Laptops"
            primaryTypographyProps={{
              sx: { fontWeight: "bold", fontSize: 20 },
            }}
          />
        </ListItem>
        <ListItem className="horizontal-list-item">
          <ListItemAvatar>
            <Avatar
              src="https://www.shutterstock.com/image-vector/computer-flat-colored-icon-260nw-786266977.jpg"
              style={{ width: 55, height: 55 }}
            />
          </ListItemAvatar>
          <ListItemText
            primary="PC"
            primaryTypographyProps={{
              sx: { fontWeight: "bold", fontSize: 20 },
            }}
          />
        </ListItem>
      </List>

      <CardMedia
        component="img"
        alt="Imagen"
        image="https://reisdigital.es/wp-content/uploads/2022/10/los-mejores-software-y-hardware-para-tu-empresa.jpg"
        sx={{
          width: 600,
          margin: "auto",
          display: "block",
          borderRadius: 10,
        }}
      />
      <Typography
        sx={{
          marginTop: 1,
          fontSize: 20,
          display: "flex",
          justifyContent: "center",
          fontWeight: "bold",
        }}
      >
        Somos una empresa dedicada a la solución de fallas en los dispositivos
        inteligentes
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 14,
          marginBottom: 60,
        }}
      >
        <Button
          type="submit"
          variant="contained"
          sx={{
            marginTop: 2,
            fontWeight: "bold",
            fontSize: 16, // Ajusta el tamaño de la fuente según sea necesario
            padding: "10px 30px", // Ajusta el padding según sea necesario
            width: '300px',
            marginBottom: 60,
          }}
          onClick={handleLoginClick}
        >
          Iniciar sesión
        </Button>
      </div>
    </Paper>
  );
}

export default Home;
