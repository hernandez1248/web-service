import db from "database/models"//responsable de detectar el tipo de requestS
//e invocar a la funcion adecuada
export default function handler(req,res) {
    switch(req.method) {
        case 'GET':
            return statesList(req, res);
        case 'DELETE':
            return statesDelete(req, res);
        case 'PATCH':
            return statesUpdate(req, res);
        case 'POST':
            return statesAdd(req, res);            
        default:
            res.status(400).json({error: true, message: "Peticion errónea"})
    }
}


const statesList = async (req, res) => {
    try {
        //leer el state a filtrar
        const { stateId } = req.query;
        const { queryState } = req.query;

        //Proporcion de operadores
        const { Op } = require("sequelize");
        //leer los estados
        let states = [];
        if (stateId) {
            states = await db.State.findAll({
            where: {
                id:stateId,
            },
                include: ['order'],
            });
        }else if(queryState){
            
            states = await db.State.findAll({
                where: {
                    [Op.or]: [{
                    name: {//[Op.like]: 'tra%'
                        [Op.like]: queryState+'%'
                    }}
                ]
            },
            });
        }else {
            states = await db.State.findAll({
                include: ['order'],
            })
        }


        return res.json(states);
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

const statesAdd = async (req, res) => {
    try {
        //los datos vienen en el req.body
        console.log(req.body);

        //guardar el state
        const states = await db.State.create({ ...req.body});

        res.json({
            states,
            message: 'El estado de la orden se registró correctamente'
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

const statesUpdate = async (req, res) => {
    try {
        //los datos vienen en el req.body

        const {id} = req.body;
        console.log(req.body);

        //guardar el cliente
        const states = await db.State.update({ 
            ...req.body
        },{ where: {
            id,
        },
            include: ['order'],
        });

        const state = states[0];
        if (state === 0) {
            return res.status(404).json({ message: 'El estado seleccionadap no fue encontrada' });
          }

        return res.json({
            states,
            message: "El estado fue actualizado correctamente"
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

const statesDelete = async (req, res) => {
    try {
      const { id } = req.query;
  
      // Verificar si el usuario existe antes de eliminarlo
      const state = await db.State.findOne({
        where: {
          id
        },
      });
  
      if (!state) {
        return res.status(404).json({
          error: true,
          message: "El estado no existe.",
        });
      }
  
      // Eliminar el usuario existente
      await db.State.destroy({
        where: {
          id
        },
      });
      res.json({
        message: "El estado ha sido eliminado.",
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
