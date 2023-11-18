import db from "database/models"//responsable de detectar el tipo de request 
//e invocar a la funcion adecuada
export default function handler(req,res) {
    switch(req.method) {
        case 'GET':
            return componentsList(req, res);
        case 'DELETE':
            return componentsDelete(req, res);
        case 'PATCH':
            return componentsUpdate(req,res);
        case 'POST':
            return componentsAdd(req,res);            
        default:
            res.status(400).json({error: true, message: "Peticion errónea"})
    }
}

const componentsList = async (req, res) => {
    try {
        //leer el Component a filtrar
        const { name, deviceId } = req.query;

        //Proporcion de operadores
        const { Op } = require("sequelize");
        //leer los Component
        let components = [];
        if (name) {
            components = {
                [Op.or]: [{
                    name: {//[Op.like]: 'tra%'
                        [Op.like]: `%${name}%`,
                    },
                }],
            };
        }
        if (deviceId) {
            components = {
              ...components,
              deviceId,
            };
          }

        const componentes = await db.Component.findAll({
            where: components,
            include: ['devices','orderdetail'],
        });

        return res.json(componentes);
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

// const componentsDelete = async (req, res) => {
//     try {
//         //leer 
//         const { componentSelected } = req.query;        
//         //leer los components
//         let components = [];
//         if (componentSelected) {
//             components = await db.Component.destroy({
//                 where: {
//                     id: componentSelected
//                 },
//             });
//         } 
        
//         else {
//             components = await db.Component.findAll({
//             })
//         }

//         res.json({
//             message: 'El componente fue eliminado correctamente'
//         });
//     } catch(error) {
//         console.log(error)
//         return res.status(400).json(
//             {
//                 error: true,
//                 message: `Ocurrio un error al procesar la peticion: ${error.message}`        
//             }
//         )
    
//     }
// }

const componentsDelete = async (req, res) => {
    try {
      const { id } = req.query;
  
      // Verificar si el usuario existe antes de eliminarlo
      const component = await db.Component.findOne({
        where: {
          id
        },
      });
  
      if (!component) {
        return res.status(404).json({
          error: true,
          message: "El componente no existe.",
        });
      }
  
      // Eliminar el usuario existente
      await db.Component.destroy({
        where: {
          id
        },
      });
      res.json({
        message: "El componente ha sido eliminado.",
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

const componentsUpdate = async (req, res) => {
    try {
        //los datos vienen en el req.body
        
        const {id} = req.body;
        console.log(req.body);

        //guardar el cliente
        await db.Component.update({ 
            ...req.body
        },{ where: {
            id,
        },
            include: ['devices','orderdetail'],
        });

        res.json({
            message: 'El componente fue actualizado correctamente'
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

const componentsAdd = async (req, res) => {
    try {
        //los datos vienen en el req.body
        console.log(req.body);

        //guardar el cliente
        const component = await db.Component.create({ ...req.body});

        res.json({
            component,
            message: 'El componente se registró correctamente'
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
