import { prisma } from "../../lib/prisma";
import { obtenerUsuarioPorCorreo } from "./usuario.service";
import cloudinary from "../config/cloudinary";

interface ICreateNotice {
    titulo: string,
    contenido: string,
    publicada: boolean,
    correo_usuario: string
}






//Crear Noticia
export async function crearNoticia(
    noticia: ICreateNotice,
    imagen: Express.Multer.File
) {
    console.log(noticia.correo_usuario);
    const user = await obtenerUsuarioPorCorreo(noticia.correo_usuario);
    if (!user) {
        const error = new Error("El usuario no existe");
        (error as any).statusCode = 404;
        (error as any).codigo = "USUARIO_NO_EXISTE";
        throw error;
    }
    const idUser = user.id;

    //Subir la imagen a Cloudinary y obtener la URL

    const resultado = await cloudinary.uploader.upload(
        imagen.path,
        {
            folder: "imgNoticias",
            resource_type: "image"
        }
    );

    const imagen_url = resultado.secure_url;



    const result = await prisma.noticias.create({
        data: {
            titulo: noticia.titulo,
            contenido: noticia.contenido,
            imagen_url: imagen_url,
            publicada: Boolean(noticia.publicada),
            usuario_id: idUser
        }
    });
    return result;
}


//Obtener cada noticia 
export async function obtenerNoticias() {
    const result = await prisma.noticias.findMany();
    return result;
}

//Obtener noticia por id

export async function obtenerNoticiaPorId(id: string) {
    const result = await prisma.noticias.findFirst({ where: { id } });
    if (!result) {
        const error = new Error("La noticia no existe");
        (error as any).statusCode = 404;
        (error as any).codigo = "NOTICIA_NO_EXISTE";
        throw error;
    }
    return result;
}

//Obtener noticias publicadas
export async function obtenerNoticiasPublicadas() {
    const result = await prisma.noticias.findMany({ where: { publicada: true } });
    return result;
}

//Eliminar noticia por id
export async function eliminarNoticiaPorId(id: string) {
    const noticia = await obtenerNoticiaPorId(id);
    if (!noticia) {
        const error = new Error("La noticia no existe");
        (error as any).statusCode = 404;
        (error as any).codigo = "NOTICIA_NO_EXISTE";
        throw error;
    }
    await prisma.noticias.delete({ where: { id } });
}


interface IUpdateNotice {
    id: string,
    titulo: string,
    contenido: string,
    imagen_url: string,
    publicada: boolean,
    correo_usuario: string
}


//Actualizar noticia por id
export async function actualizarNoticiaPorId(noticiaActualizada: Partial<IUpdateNotice>) {
    //Obtener el usuario por el correo
    const user = await obtenerUsuarioPorCorreo(noticiaActualizada.correo_usuario || "");
    if (!user) {
        const error = new Error("El usuario no existe");
        (error as any).statusCode = 404;
        (error as any).codigo = "USUARIO_NO_EXISTE";
        throw error;
    }
    const idUser = user.id;

    
    
    if (!noticiaActualizada.id) {
        const error = new Error("El id de la noticia es requerido");
        (error as any).statusCode = 400;
        (error as any).codigo = "ID_NOTICIA_REQUERIDO";
        throw error;
    }
    const noticia = await obtenerNoticiaPorId(noticiaActualizada.id);
    if (!noticia) {
        const error = new Error("La noticia no existe");
        (error as any).statusCode = 404;
        (error as any).codigo = "NOTICIA_NO_EXISTE";
        throw error;
    }

    const result = await prisma.noticias.update({
        where: { id: noticiaActualizada.id },
        data: {
            titulo: noticiaActualizada.titulo,
            contenido: noticiaActualizada.contenido,
            imagen_url: noticiaActualizada.imagen_url,
            publicada: noticiaActualizada.publicada,
            usuario_id: idUser
        }
    });
    return result;
}