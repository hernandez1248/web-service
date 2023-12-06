import db from "database/models"//responsable de detectar el tipo de requestS
//e invocar a la funcion adecuada
export default function handler(req,res) {
    switch(req.method) {
        case 'GET':
            return orderDetailsList(req, res);
        case 'DELETE':
            return orderDetailsDelete(req, res);
        case 'PATCH': 
            return orderDetailsUpdate(req, res);
        case 'POST':
            return orderDetailsAdd(req, res);            
        default:
            res.status(400).json({error: true, message: "Peticion errónea"})
    }
}

const orderDetailsList = async (req, res) => {
    try {
        //leer el detailss a filtrar
        const { ordersId } = req.query;

        //Proporcion de operadores
        const { Op } = require("sequelize");
        //leer los estados
        let orderDetails = [];
        if (ordersId) {
            orderDetails = await db.Orderdetails.findAll({
            where: {
                ordersId,
            },
                include: ['order'],
            });
        }else {
            orderDetails = await db.Orderdetails.findAll({
                include: ['order'],
            })
        }


        return res.json(orderDetails);
    } catch(error) {
        console.log(error)
        return res.status(400).json(
            {
                error: true,
                message: `Ocurrio un error al procesar la peticion: ${error.message}`        
            }
        )
    
    }
}

const orderDetailsAdd = async (req, res) => {
    try {
        //los datos vienen en el req.body
        console.log(req.body);

        //guardar el detailss
        const orderDetails = await db.Orderdetails.create({ ...req.body});

        res.json({
            orderDetails,
            message: 'El detalle de la orden se registró correctamente'
        });

    } catch(error) {
        console.log(error)

        let errors =[];
        if (error.errors){
            //extrae la informacion de los campos que tienen error
            errors = error.errors.map((item) => ({
                error: item.message,
                field: item.path,

            }));
        }

        return res.status(400).json(
            {
                error: true,
                message: `Ocurrio un error al procesar la peticion: ${error.message}`,
                errors,      
            }
        )
    
    }
}

const orderDetailsUpdate = async (req, res) => {
    try {
        //los datos vienen en el req.body
        const {id} = req.body;
        console.log(req.body);

        //guardar el cliente
        const orderDetails = await db.Orderdetails.update({ 
            ...req.body
        },{ where: {
            id,
        },
            include: ['order'],
        });

        const detailss = orderDetails[0];
        if (detailss === 0) {
            return res.status(404).json({ message: 'El detalle de orden seleccionado no fue encontrada' });
          }

        return res.json({
            orderDetails,
            message: "El detalle de orden fue actualizado correctamente"
        });

    } catch(error) {
        console.log(error)

        let errors =[];
        if (error.errors){
            //extrae la informacion de los campos que tienen error
            errors = error.errors.map((item) => ({
                error: item.message,
                field: item.path,

            }));
        }

        return res.status(400).json(
            {
                error: true,
                message: `Ocurrio un error al procesar la peticion: ${error.message}`,
                errors,      
            }
        )

    }
}

const orderDetailsDelete = async (req, res) => {
    try {
      const { id } = req.query;
  
      // Verificar si el usuario existe antes de eliminarlo
      const detailss = await db.Orderdetails.findOne({
        where: {
          id
        },
      });
  
      if (!detailss) {
        return res.status(404).json({
          error: true,
          message: "El detalle de orden no existe.",
        });
      }
  
      // Eliminar el usuario existente
      await db.Orderdetails.destroy({
        where: {
          id
        },
      });
      res.json({
        message: "El detalle de orden ha sido eliminado.",
      });
    } catch (error) {
      console.log(error);
      let errors = [];
      if (error.errors) {
        errors = error.errors.map((item) => ({
          error: item.message,
          field: item.path,
        }));
      }
      return res.status(400).json({
        error: true,
        message: `Ocurrió un error al procesar la información: ${error.message}`,
        errors,
      });
    }
  };
