import db from "database/models"//responsable de detectar el tipo de request 
//e invocar a la funcion adecuada
export default function handler(req,res) {
    switch(req.method) {
        case 'GET':
            return deviceList(req, res);
       /* case 'POST':
            return filterDevice(req, res);*/
        case 'DELETE':
            return deviceDelete(req, res);
        case 'PATCH':
            return deviceUpdate(req,res);
        case 'POST':
            return deviceAdd(req,res);            
        default:
            res.status(400).json({error: true, message: "Peticion errónea"})
    }
}

const deviceList = async (req, res) => {
    try {
        //leer el Device a filtrar
        const { deviceId } = req.query;
        const { queryDevice } = req.query;

        //Proporcion de operadores
        const { Op } = require("sequelize");
        //leer los Device
        let devices = [];
        if (deviceId) {
            devices = await db.Device.findAll({
            where: {
                id:deviceId,
            },
                include: ['deviceCategory','component','order'],
            });
        }else if(queryDevice){
            
            devices = await db.Device.findAll({
                where: {
                    [Op.or]: [{
                    name: {//[Op.like]: 'tra%'
                        [Op.like]: queryDevice+'%'
                    }}
                ]
            },
            });
        }else {
            devices = await db.Device.findAll({
                include: ['deviceCategory','component','order'],
            })
        }


        return res.json(devices);
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


const deviceDelete = async (req, res) => {
    try {
        //leer la categoria a filtrar
        const { deviceSelected } = req.query;        
        //leer los Device
        let devices = [];
        if (deviceSelected) {
            devices = await db.Device.destroy({
                where: {
                    id: deviceSelected
            },
                include: ['deviceCategory','component','order'],
            });
        } 
        
        else {
            devices = await db.Device.findAll({
                include: ['deviceCategory','component','order'],
            })
        }
        return res.json(devices);
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

const deviceUpdate = async (req, res) => {
    try {
        //los datos vienen en el req.body
        
        const {id} = req.body;
        console.log(req.body);

        //guardar el cliente
        const devices = await db.Device.update({ 
            ...req.body
        },{ where: {
            id,
        },
        include: ['deviceCategory','component','order'],
        });

        res.json({
            devices,
            message: 'El dispositivo fue actualizado correctamente'
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

const deviceAdd = async (req, res) => {
    try {
        //los datos vienen en el req.body
        console.log(req.body);

        //guardar el dispositivo
        const devices = await db.Device.create({ ...req.body});

        res.json({
            devices,
            message: 'El dispositivo se registro correctamente'
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