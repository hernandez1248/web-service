import db from "database/models"//responsable de detectar el tipo de request 
//e invocar a la funcion adecuada
export default function handler(req,res) {
    switch(req.method) {
        case 'GET':
            return orderList(req, res);
        case 'DELETE':
            return orderDelete(req, res);
        case 'PATCH':
            return orderUpdate(req,res);
        case 'POST':
            return orderAdd(req,res);            
        default:
            res.status(400).json({error: true, message: "Peticion errónea"})
    }
}

const orderList = async (req, res) => {
    try {
        //leer el Order a filtrar
        const { orderId } = req.query;
        const { queryOrder } = req.query;

        //Proporcion de operadores
        const { Op } = require("sequelize");
        //leer los Order
        let orders = [];
        if (orderId) {
            orders = await db.Order.findAll({
            where: {
                id:orderId,
            },
                include: ['servicescategory','device','user','orderdetails','state'],
            });
        }else if(queryOrder){
            
            orders = await db.Order.findAll({
                where: {
                    [Op.or]: [{
                    name: {//[Op.like]: 'tra%'
                        [Op.like]: queryOrder+'%'
                    }}
                ]
            },
            });
        }else {
            orders = await db.Order.findAll({
                include: ['servicescategory','device','user','orderdetails','state'],
            })
        }


        return res.json(orders);
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


const orderDelete = async (req, res) => {
    try {
        //leer la categoria a filtrar
        const { orderSelected } = req.query;        
        //leer los Order
        let orders = [];
        if (orderSelected) {
            orders = await db.Order.destroy({
                where: {
                    id: orderSelected
            },
                include: ['servicescategory','device','user','orderdetails','state'],
            });
        } 
        
        else {
            orders = await db.Order.findAll({
                include: ['servicescategory','device','user','orderdetails','state'],
            })
        }
        return res.json(orders);
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

const orderUpdate = async (req, res) => {
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

const orderAdd = async (req, res) => {
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