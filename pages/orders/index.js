import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { useState } from "react";
import apiClient from "@/apiClient";
import CardOrders from "@/components/cards/cardOrders";
import ModalContentAddOrder from "@/components/modals/addOrders";

const OrdersView = () => {

  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const deleteOrder = (index) => {
      //Clonar Orders
      const ordersCopy = [...orders];
      ordersCopy.splice(index,1);
      //Actualizar el estado orders con la nueva lista
      setOrders(ordersCopy);

  }
  useEffect(() => {
    apiClient.get("./api/orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos de los usuarios:", error);
      });
  }, []);
  console.log(orders);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }
  
  const renderOrders = () => {
     return orders.map( (order, index) => (
       <Grid item xs={12} lg={4} xl={12} key={order.id}>
       <CardOrders
       index = {index}
       order = {order}
       onDelete = {deleteOrder}                
       ruteDirection = {`/orders/${order.id}`}
      />   
     </Grid>
     ))
 };
 
  return (
    <Box>
      <div>
        Hola, aqui va la interfaz de ordenes
      </div>
      <Button onClick={handleOpenModal}>Agregar orden</Button>
      
      <Grid container spacing={2}>
          {renderOrders()}
      </Grid>
      <ModalContentAddOrder open={isModalOpen} handleClose={handleCloseModal} />
    </Box>
  )
}

export default OrdersView;