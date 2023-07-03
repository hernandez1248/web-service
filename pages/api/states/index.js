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
            id
        },
            include: ['order'],
        });

        res.json({
            states,
            message: 'El estado fue actualizado correctamente'
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
        //leer la categoria a filtrar
        const { stateSelected } = req.query;        
        //leer los state
        let states = [];
        if (stateSelected) {
            states = await db.State.destroy({
                where: {
                    id: stateSelected
            },
                    include: ['order'],
            });
        } 
        
        else {
            states = await db.State.findAll({
                    include: ['order'],
            })
        }
        res.json({
            states,
            message: 'El estado se eliminó correctamente'
        });
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
