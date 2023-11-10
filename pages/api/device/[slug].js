import db from "database/models"//responsable de detectar el tipo de request 
//e invocar a la funcion adecuada
export default function handler(req,res) {
    switch(req.method) {
        case 'GET':
            return showList(req, res); 
        default:
            res.status(400).json({error: true, message: "Peticion errónea"})
    }
}
const showList = async (req, res) => {
    try {
        //leer la categoria a filtrar
        console.log(req.query)
        const device = await db.Device.findOne({
            where: {id: req.query.slug}
        })

        if(!device) {
            return  res.status(404).json({
                message: 'El dispositivo no existe'
            })
        }

        return res.json({...device.dataValues}); 
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