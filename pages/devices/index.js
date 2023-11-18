import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";  // Paso 1: Importa Button
import ButtonClose from "@/components/ButtonClose";
import PeopleIcon from "@mui/icons-material/People";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import ConstructionIcon from "@mui/icons-material/Construction";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/router";
import {IconButton } from '@mui/material';
import { useSession } from 'next-auth/react';
import CardDevices from "@/components/cards/cardDevices";


const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const MiniDrawer = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
 

  const router = useRouter();

  const handleHomeClick = () => {
    router.push("/home"); // Reemplaza con la ruta correcta a la página de usuarios
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { data: session } = useSession();


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{backgroundColor: "rgb(34, 51, 84)",}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <Typography variant="h6" noWrap component="div">
              Dispositivos
            </Typography>
            <ButtonClose user={session?.user} />
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["Usuarios", "Ordenes", "Dispositivos", "Componentes"].map(
            (text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    padding: 3,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 4 : "auto",
                      justifyContent: "center",
                      color: '#223354'
                    }}
                  >
                    {index === 0 ? (
                      <HomeIcon onClick={handleHomeClick} />
                    ) : index === 1 ? (
                      <PeopleIcon onClick={() => handleOrdenesClick()} />
                    ) : index === 2 ? (
                      <ShoppingCartIcon
                        onClick={() => handleDispositivosClick()}
                      />
                    ) : index === 3 ? (
                      <SmartphoneIcon
                        onClick={() => handleDispositivosClick()}
                      />
                    ) : (
                      <ConstructionIcon
                        onClick={() => handleComponentesClick()}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            )
          )}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
          <CardDevices />
      </Box>
    </Box>
  );
};

export default MiniDrawer;
