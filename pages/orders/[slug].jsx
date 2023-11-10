import React from 'react';//se puede poner y no, ya que estamos trabajando con react
import Typography from '@mui/material/Typography';
import { Container, Grid, Paper, Chip, TextField, FormControl, InputLabel, Select, MenuItem, Autocomplete, NativeSelect, Breadcrumbs } from '@mui/material';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import apiClient from 'apiClient'
import {useRouter} from 'next/router';

export default function Products(){
    const router = useRouter();
    const [orders,setOrders] = useState([])
    //console.log(router)

    useEffect(() => {
        if(router.query.slug){
        apiClient.get(`/api/orders/${router.query.slug}`)
        .then((response) => {
            //console.log(response.data)
            //alert('si conecto');
            setOrders(response.data)
        })
        .catch((error) => {
            alert("Error al visualizar orden, intente más tarde")
        });
        }
    }, [router]);

    console.log(orders)
    return (
        <>
        <Head>
            <title>Ordenes</title>
            <meta name="description" content="Generated by create next app" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>


        <Paper>
        <h1>Informacion de la orden generada</h1>
        
        <Typography>Nombre completo: {orders?.fullName}</Typography>
        <Typography>Telefono: {orders?.phone}</Typography>
        
    <Container>
    </Container>
    </Paper>

</>
    )
}