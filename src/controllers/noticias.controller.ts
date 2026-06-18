import {Request, Response} from "express";
import { crearNoticia ,obtenerNoticiaPorId, obtenerNoticias, actualizarNoticiaPorId, eliminarNoticiaPorId, obtenerNoticiasPublicadas} from "../services/noticia.service";
import multer from "multer";



export async function createNotice(
    req: Request,
    res: Response,
) {
    try {
        const imagen = req.file as Express.Multer.File;
        console.log("Creando noticia...");
        console.log(req.body);
        const result = await crearNoticia(
            req.body,
            imagen
        );
        
        console.log(`Noticia registrada: ${result}`)

        return res.status(201).json({
            mensaje: "Noticia creada correctamente",
            data: {
                titulo: result.titulo,
                contenido: result.contenido,
                imagen_url: result.imagen_url
            }
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}   


//Obtener todas las noticias
export async function getNotices(
    req: Request,
    res: Response,
) {
    try {
        const result = await obtenerNoticias();
        console.log(`Noticias obtenidas: ${result.length}`)
        return res.status(200).json({
            mensaje: "Noticias obtenidas correctamente",
            data: result
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}


interface ParamsNoticeId {
    id: string;
}

//Obtener noticia por id
export async function getNoticeById(
    req: Request<ParamsNoticeId>,
    res: Response,
) {
    try {
        const { id } = req.params;
        const result = await obtenerNoticiaPorId(id);
        return res.status(200).json({
            mensaje: "Noticia obtenida correctamente",
            data: result
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}


//Obtener noticias publicadas
export async function getPublishedNotices(
    req: Request,
    res: Response,
) {
    try {
        const result = await obtenerNoticiasPublicadas();
        console.log(`Noticias publicadas obtenidas: ${result.length}`)
        return res.status(200).json({
            mensaje: "Noticias publicadas obtenidas correctamente",
            data: result
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    } 
}

//Eliminar noticia por id
export async function deleteNoticeById(
    req: Request,
    res: Response,
) {
    try {
        const { id } = req.body;
        await eliminarNoticiaPorId(id);
        return res.status(200).json({
            mensaje: "Noticia eliminada correctamente"
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}


//Modificar Noticia por id
export async function updateNoticeById(
    req: Request,
    res: Response,
) {
    try {
        console.log("body", req.body);
        console.log("params", req.params);
        const result = await actualizarNoticiaPorId(req.body);
        return res.status(200).json({
            mensaje: "Noticia actualizada correctamente",
            data: result
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}