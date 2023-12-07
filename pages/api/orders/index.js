import db from "database/models"//responsable de detectar el tipo de request 
//e invocar a la funcion adecuada
export default function handler(req, res) {
    switch (req.method) {
        case 'GET':
            return orderList(req, res);
        case 'DELETE':
            return orderDelete(req, res);
        case 'PATCH':
            return orderUpdate(req, res);
        case 'POST':
            return orderAdd(req, res);
        default:
            res.status(400).json({ error: true, message: "Peticion errónea" })
    }
}

const orderList = async (req, res) => {
    try {
        //leer el Order a filtrar      
        const { orderId, dateRegister, fullName, servicesId, status, userId } = req.query;

        //Proporcion de operadores
        const { Op } = require("sequelize");
        //leer los Order
        let orders = [];

        let states = [];

        if (fullName) {
            orders = {
                [Op.or]: [{
                    fullName: {//[Op.like]: 'tra%'
                        [Op.like]: `%${fullName}%`,
                    },
                }],
            };
        }
        if (servicesId) {
            orders = {
                ...orders,
                servicesId,
            };
        }

        if (status) {
            states = await db.State.findAll({
                where: {
                    status,
                },
                attributes: ['ordersId'], // Seleccionar solo el ID de las órdenes
                raw: true, // Obtener resultados como objetos simples
                //include: ['order'],
            });

            const filterStatusOrderId = states.map(state => state.ordersId);

            orders = {
                ...orders,
                id: filterStatusOrderId,
            };
        }

        if (userId) {
            orders = {
                ...orders,
                userId,
            };
        }


        /*if (orderId) {
            orders = await db.Order.findAll({
            where: {
                id:orderId,
            },
                include: ['servicescategory','device','user','orderdetails','state'],
            });


                //console.log(orders);
                if (Object.keys(orders).length === 0) {
                    return res.status(404).json({ message: 'Orden no encontrada' });
                  }

                    return res.json({ orders,message: 'Orden encontrada' });
                

        }else if(dateRegister){ 
                    //Aqui comienza el filtro de fordenes por fecha

                    // Proporcion de operadores
                    const { Op } = require("sequelize");
                    const whereFilter = {};

                    if (dateRegister) {
                    const fecha = new Date(dateRegister);

                    whereFilter.date = {
                        [Op.and]: [
                        {
                            [Op.gte]: db.sequelize.fn('DATE', fecha),                                                                                                                           // Mayor o igual que la fecha especificada (sin tener en cuenta la hora)
                        },
                        {
                            [Op.lt]: db.sequelize.fn('DATE', db.sequelize.literal(`DATE_ADD('${dateRegister}', INTERVAL 1 DAY)`)),                                                              // Menor que la siguiente fecha (24 horas después)
                        },
                        ],
                    };
                    }

                    // Leer Order
                    const orders = await db.Order.findAll({
                    where: whereFilter,
                    include: ['servicescategory', 'device', 'user', 'orderdetails', 'state'],
                    });

                    return res.json({ orders,message: 'Orden encontrada' });

        }
        else {
            orders = await db.Order.findAll({
                include: ['servicescategory','device','user','orderdetails','state'],
            })
        }*/
        const ordenes = await db.Order.findAll({
            where: orders,
            include: ['servicescategory', 'device', 'user', 'orderdetails', 'state'],
        });

        return res.json(ordenes);
    } catch (error) {
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
        let stateSearchDelete = [];
        let orderDetailsSearchDelete = [];
        let orders = [];
        if (orderSelected) {

            stateSearchDelete = await db.State.destroy({
                where: {
                    ordersId: orderSelected
                },
                include: ['order'],
            });

            orderDetailsSearchDelete = await db.Orderdetails.destroy({
                where: {
                    ordersId: orderSelected
                },
                include: ['order', 'component'],
            });


            orders = await db.Order.destroy({
                where: {
                    id: orderSelected
                },
                include: ['servicescategory', 'device', 'user', 'orderdetails', 'state'],
            });


            if (orders === 0) {
                return res.status(404).json({ message: 'Orden no encontrada' });
            }

            return res.json({ orders, message: 'Eliminada correctamente' });
        }

        else {
            orders = await db.Order.findAll({
                include: ['servicescategory', 'device', 'user', 'orderdetails', 'state'],
            })
        }
        return res.json(orders);
    } catch (error) {
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

        const { id, advancePay } = req.body;
        console.log(req.body);
        //let remainingPay;

        const orderToUpdate = await db.Order.findByPk(id);
        const fullPay = orderToUpdate.fullPay; // Obtiene el valor del fullPay de la orden

        const remainingPay = fullPay - advancePay; // Calcula el remainingPay
      
        // Actualiza la orden con los nuevos datos, incluyendo remainingPay
        const orders = await db.Order.update({
            ...req.body,remainingPay
        }, {
            where: {
                id
            },
            include: ['servicescategory', 'device', 'user', 'orderdetails', 'state'],
        });


        //console.log("///////////////////////////");  
        const order = orders[0];
        //console.log(number);
        /*
            console.log(orders)
            if (number === 0) {
               console.log("no encontradaaaaaaaa");
              } else if (number ===1) {
                console.log("si encontradaaaaaaaaaaaaaaaaa");
              }else{
                console.log("Anda mal");
              }

        */
        //Object.keys(orders).length === 0
        if (order === 0) {
            return res.status(404).json({ message: 'La orden seleccionada no fue encontrada' });
        }

        return res.json({ orders, message: 'La orden fue actualizada correctamente' });

    } catch (error) {
        console.log(error)

        let errors = [];
        if (error.errors) {
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
        const { servicesId, deviceId, userId, fullName, phone, color, observations, fullPay, advancePay, remainingPay, detalles } = req.body;
        const { componentsId, amountTotal, quantityComponent, unitPrice } = req.body;


        // se crea una orden asociada a sus detalles de la misma orden
        const newIdOrden = await db.Order.create({
            servicesId,
            deviceId,
            userId,
            fullName,
            phone,
            color,
            observations,
            fullPay: '0',
            advancePay,
            remainingPay
        });

        const newState = await db.State.create({
            ordersId: newIdOrden.id,
            status: 'Registrada',
            description: "Se registro correctamente la orden"

        })

        let moveDatePrice;
        let stockActual;
        let remaining;

        //guardar los detalles de una orden
        if (detalles) {
            await Promise.all(
                detalles.map(async (direccion) => {

                    const searchComponent = await db.Component.findAll({
                        where: {
                            id: direccion.componentsId,
                        },
                        include: ['devices'],
                    });

                    //let resultado = numero1 + numero2;
                    searchComponent.forEach(item => {
                        //console.log(item.price);

                        // Mas operaciones
                        moveDatePrice = item.price;
                        stockActual = item.stock;
                        // let resultadoSuma = parseFloat(moveDatePrice) + 11;
                        // console.log(resultadoSuma);
                        // console.log(stockActual + 11);
                        return moveDatePrice, stockActual
                    });


                    //Obtener el stock final
                    let stock = stockActual - direccion.quantityComponent; //stock actual menos la cantidad de componentes seleccionada
                    let amountTotal = parseFloat(moveDatePrice) * direccion.quantityComponent

                    ///console.log("CANTIDAD TOTAL ="+ amountTotal)
                    /*await db.Component.update({ 
                        stock:stockFinal
                    },{ where: {
                        id:direccion.componentsId,
                    },
                    include: ['devices','orderdetail'],
                    });
                */
                    await db.Orderdetails.create({
                        ordersId: newIdOrden.id,
                        componentsId: direccion.componentsId,
                        amountTotal, //se agrega en automatico
                        quantityComponent: direccion.quantityComponent,
                        unitPrice: moveDatePrice //se agrega en automatico
                    });


                    const actualizarStock = await db.Component.update({ stock }, {
                        where: { id: direccion.componentsId },
                    });
                }
                ))

        }

        // Calcula el monto total de los detalles de la orden
        let totalAmount = await db.Orderdetails.sum('amountTotal', {
            where: {
                ordersId: newIdOrden.id,
            },
        });

        totalAmount = totalAmount + 200

        if (advancePay > 0) {
            remaining = totalAmount - advancePay
        } else {
            remaining = totalAmount - 0
        }


        if (totalAmount === undefined || totalAmount === null) {
            newIdOrden.fullPay = 200; // Asigna cero si totalAmount es undefined o null
        } else {
            newIdOrden.fullPay = totalAmount; // Asigna el valor de totalAmount si es válido
        }
        // Agrega el monto total al campo 'fullPay' de la orden generada
        //newIdOrden.fullPay = totalAmount;
        newIdOrden.remainingPay = remaining



        await newIdOrden.save();


        res.json({
            newIdOrden, newState,
            message: 'La orden se registro correctamente'
        });

    } catch (error) {
        console.log(error)

        let errors = [];
        if (error.errors) {
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
