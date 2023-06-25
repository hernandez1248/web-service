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
        //leer el component a flitrar
        const { id } = req.query;

        //leer las components
        let components = [];
        if (id) {
            components = await db.Component.findAll({
                where:{
                    id,
                },
            });
        } else {
            components = await db.Component.findAll({
            }); 
        }
        return res.json(components);
    } catch(error){
        console.log(error);
        return res.status(400).json(
            {
                error: true,
                message:`Ocurrió un error al procesar la petición: ${error.message}`
            }
        )
    }
}

// const componentsList = async (req, res) => {
//     try {
//         //leer la categoria a filtrar
//         const { categoryId } = req.query;
//         //leer los components
//         let components = [];
//         if (categoryId) {
//             components = await db.Device.findAll({
//                 where: {
//                         categoryId,
//                 },
//                 include: ['category'],
//             });
//         } 
        
//         else {
//             components = await db.Component.findAll({
//                 include: ['category'],
//             })
//         }

//         return res.json(components);
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
        //leer la categoria a filtrar
        const { componentSelected } = req.query;        
        //leer los Book
        let components = [];
        if (componentSelected) {
            components = await db.Component.destroy({
                where: {
                    id: componentSelected
            },
                include: ['category'],
            });
        } 
        
        else {
            components = await db.Component.findAll({
                include: ['category'],
            })
        }
        return res.json(components);
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

const componentsUpdate = async (req, res) => {
    try {
        //leer la categoria a filtrar
        const { componentsUpdates } = req.query;
        //leer las peticiones a actualizar
        const { name } = req.query;
        const { price } = req.query;
        const { stock } = req.query;
        const { categoryId } = req.query;


        const names=()=>{
            if(name==null){
                console.log("no se hizo nada")
            }else if(name !=null){
               return  name
            }
        }
        names()
        
        const stocks=()=>{
            if(stock==null){
               console.log("no se hizo nada")
            }else if(stock !=null){
               return  stock
            }
        }
        stocks()

        const prices=()=>{
            if(price==null){
               console.log("no se hizo nada")
            }else if(price !=null){
               return  price
            }
        }
        prices()

        const categoriesID=()=>{
            if(categoryId==null){
               console.log("no se hizo nada")
            }else if(categoryId !=null){
               return  categoryId
            }
        }
        categoriesID()

        
        //Proporcion de operadores
        //const { Op } = require("sequelize");
        //leer los components
        let components = [];
        if (componentsUpdates) {
            
            components = await db.Component.update({
                name,price,stock,categoryId
                // ...
            }, {  where: {
                id: componentsUpdates,
        },
        include: ['category'],
            });
        } 
        
        
        else {
            components = await db.Component.findAll({
                include: ['category'],
            })
        }


        /*Prueba de where o busqueda de ID
            where: {
                id:6,
            }*/
        return res.json(components);
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
