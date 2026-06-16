import { Request, Response } from "express";

import { obtenerProductosPorUbicacion} from "../services/ubicacion.service";

//Obtener productos por ubicación
export async function getProductsByLocation(
    req: Request,
    res: Response,
) {
    try {
        const { pasillo, estante, charola, cajon } = req.body;
        const result = await obtenerProductosPorUbicacion(pasillo, estante, charola, cajon);
        console.log(`Productos obtenidos por ubicación ${pasillo}-${estante}-${charola}-${cajon}: ${result.length}`)
        return res.status(200).json({
            mensaje: "Productos obtenidos correctamente",
            data: result
        });
    }
    catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}