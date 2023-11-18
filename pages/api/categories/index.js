//responsable de detectar el tipo de request 
import db from "database/models"


//e invocar a la funcion adecuada
export default function handler(req,res) {
    switch(req.method) {
        case 'GET':
            return categoriesList(req, res);

        default:
            res.status(400).json({error: true, message: "Peticion errónea"})
    }
}

const categoriesList = async (req, res) => {
    try {
        //leer los Device
        let devices = [];

        if(devices) {
            devices = await db.Devicescategory.findAll({
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