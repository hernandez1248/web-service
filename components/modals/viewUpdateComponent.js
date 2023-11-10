import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Container, Grid, TextField, InputLabel, Select, FormControl, MenuItem, Input, InputAdornment, Alert, Typography } from '@mui/material';
import { useForm } from "react-hook-form";
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import apiClient from '@/apiClient';
import { useState, useEffect } from 'react';

const ModalContentViewUpdateComponent = ({ open, handleClose, component }) => {

  const [dataComponent, setDataComponent] = React.useState({ ...component });

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const [devicesId, setDeviceId] = React.useState('');

  const [categories, setCategoriesDevice] = useState([]);

  const [categorySelected, setCategorieSelected] = useState(null);

  const [edit, setEdit] = React.useState(false);


  const handleEdit = () => {
    setEdit(!edit);
    //console.log("se presiono editar")
  }



  const cancelSave = () => {
    //resetear los datos
    setDataComponent({ ...component });
    setEdit(false);
  }


  const onSubmit = (data) => {

    //enviar la informacion del formulario al backend
    apiClient.post('/api/components', data)
      .then((response) => {
        //console.log(response.data);
        alert(response.data.message);
      })
      .catch((error) => {
        //console.log(error);
        alert(error.response.data.message);

        if (error.response.data.errors) {
          error.response.data.errors.forEach((errorItem) => {
            setError(errorItem.field, {
              type: "validation",
              message: errorItem.error
            });
          })
        }
      })
  };


  const onSelectCategory = (e) => {
    setCategorieSelected(e.target.value);
  }

  useEffect(() => {
    /*Ir por los productos desde el backend */

    apiClient.get('api/device')
      .then(response => {
        setCategoriesDevice(response.data || []);
      })
      .catch(error => {
        console.log(error);
      });

  }, []);

  

  const handleSave = async () => {
    try {
/*
    setEdit(false);
    var name=nameBook;
    var autor=nameAutor;
    var price=precioBook;
    var categoryId=categoryIdBook;
    var description=categoryDescriptionBook;
    //apiClient.update(`/api/books?bookUpdates=${data.id}&name=${name}&autor=${autor}&description=${description}&price=${price}&categoryId=${categoryId}`)

      const names=()=>{
          if(name=="" || name === undefined || name ==null){
        console.log("no se aplico nada")
          }else if(name !=null || name != undefined || name != ""){
            apiClient.patch(`/api/books?bookUpdates=${data.id}&name=${name}`)
          }
        }
        names()

      const autors=()=>{
          if(autor==null || autor === undefined || autor == ""){
        console.log("no se aplico nada")
          }else if(autor !=null  || autor != undefined || autor != ""){
            apiClient.patch(`/api/books?bookUpdates=${data.id}&autor=${autor}`)
          }
      }
      autors()

        const descriptions=()=>{
          if(description==null  || description === undefined || description == ""){
            console.log("no se aplico nada")
          }else if(description !=null  || description != undefined || description !=""){
          apiClient.patch(`/api/books?bookUpdates=${data.id}&description=${description}`)            
          }
      
      }
      descriptions()

      const prices=()=>{
        if(price==null  || price === undefined || price == ""){
          console.log("no se aplico nada")
        }else if(price !=null  || price != undefined || price != ""){
        apiClient.patch(`/api/books?bookUpdates=${data.id}&price=${price}`)
        }
    }
      prices()

      const categoriesID=()=>{
        if(categoryId==null  || categoryId === undefined || categoryId == ""){
          console.log("no se aplico nada")
        }else if(categoryId !=null  || categoryId != undefined  || categoryId != ""){
          apiClient.patch(`/api/books?bookUpdates=${data.id}&categoryId=${categoryId}`)
        }
    }
    categoriesID()

    

   //recargar pagina
   location.reload()
   */

    } catch(error) {
      alert(error)
    
    }
}



  return (

    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Visualizar componente: {dataComponent.name}</DialogTitle>


      <Container component="form" onSubmit={handleSubmit(onSubmit)}>

        <Grid item xs={8}>
          {!edit && (
            <>

              <Typography gutterBottom variant="h6" component="div" className='nameBook'>
                {dataComponent.name}
              </Typography>

            </>

          )}
          {edit && (
            <TextField
              name="nameBook"
              label="Nombre del libro:"
              variant="standard"
              defaultValue={dataComponent.name}
              onChange={ev => setNameBook(ev.target.value)}
            />
          )}
        </Grid>

        {/*<DialogContent>
          <Grid container spacing={2} sx={{ marginBottom: 8 }}>


            <Grid item xs={12} md={6}>
              <TextField
                id="name"
                label="Nombre del componente"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
                {
                ...register('name',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      value: /^[A-Z a-z áéíóú 0-9]+$/i,
                      message: 'No es un nombre valido.'
                    }
                  })
                }
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <TextField label="Precio" fullWidth
                id="price"
                error={!!errors.price}
                helperText={errors.price?.message}
                {
                ...register('price',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      value: /^[0-9]+$/i,
                      message: 'No es un precio valido.'
                    }
                  })
                }
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField label="Stock" fullWidth
                id="stock"
                error={!!errors.stock}
                helperText={errors.stock?.message}
                {
                ...register('stock',
                  {
                    required: '*Este campo es obligatorio.',
                    pattern: {
                      value: /^[0-9]+$/i,
                      message: 'No es un stock valido.'
                    }
                  })
                }
              />
            </Grid>


            <Grid item xs={12} md={6}>
              <FormControl sx={{ m: 0 }} fullWidth>
                <InputLabel id="demo-simple-select-autowidth-label">Selecciona el dispositivo</InputLabel>
                <Select
                  id='deviceId'
                  {
                  ...register('deviceId',
                    {
                      required: '*Este campo es obligatorio.',
                      pattern: {
                        message: 'No es un dispositivo valido.'
                      }
                    })
                  }
                  onChange={ev => setDeviceId(ev.target.value)}
                  fullWidth
                  label="Selecciona el dispositivo"
                  error={!!errors.deviceId}
                  helperText={errors.deviceId?.message}

                >
                  {categories.map((item) => (
                    <MenuItem key={item.id} value={item.id}>{item.model}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12} spacing={2} sx={{ textAlign: 'center' }}>
            </Grid>

          </Grid>

        </DialogContent>*/}


        <DialogActions>

        {!edit && (
          <>
            <Button size="small" onClick={handleEdit}> <ModeEditOutlineOutlinedIcon/>Editar</Button>
            <Button onClick={handleClose} color="error">
              <HighlightOffIcon />
              Cancel
            </Button>
            
          </>
          )}
          
          {edit && (
            <>
            <Button size="small" onClick={handleSave} className="buttons"><SaveOutlinedIcon />Guardar</Button>
            <Button size="small" color="error" onClick={cancelSave} className="buttons"><HighlightOffIcon />Cancelar</Button>      
            </>
                  
          )}



          {/*<Button type="submit" variant="contained">
            <SaveOutlinedIcon />
            Guardar
          </Button>*/}

        </DialogActions>
      </Container>

      <style jsx>{`
                        .cancel{
                        color: #FFFFFF;
                        text-decoration: none;
                        }
                        `}</style>
    </Dialog>
  );
};

export default ModalContentViewUpdateComponent;
