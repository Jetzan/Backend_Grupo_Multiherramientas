import { tipo_corriente } from "../../generated/prisma/enums";
import { obtenerMarcaPorNombre } from "./marca.service";
import { prisma } from "../../lib/prisma"

interface ILocationCreate {
    pasillo: string,
    estante: string,
    charola: string,
    cajon: string,
    marca?: string | null,
    notas?: string | null,
}



export async function crearUbicacion(
    ubicacion: ILocationCreate,
) {

    //Verificar si la ubicacion ya existe
    const ubicacionExistente = await obtenerUbicacion(ubicacion.pasillo, ubicacion.estante, ubicacion.charola, ubicacion.cajon).catch(() => null);

    if (ubicacionExistente) {
        const error = new Error("La ubicación ya existe");
        (error as any).statusCode = 400;
        (error as any).codigo = "UBICACION_YA_EXISTE";
        throw error;
    }

    let marca;
    if (ubicacion.marca) {
        marca = await obtenerMarcaPorNombre(ubicacion.marca);
        if (!marca) {
            const error = new Error("La marca no existe");
            (error as any).statusCode = 404;
            (error as any).codigo = "MARCA_NO_EXISTE";
            throw error;
        }
    }

    const data = {
        pasillo: ubicacion.pasillo,
        estante: ubicacion.estante,
        charola: ubicacion.charola,
        cajon: ubicacion.cajon,
        marca_id: marca?.id || null,
        notas: ubicacion.notas || null
    }
    const nuevaUbicacion = await prisma.ubicaciones.create({
        data
    });
    return nuevaUbicacion;
}


//Obtener ubicaciones
export async function obtenerUbicaciones() {
    const result = await prisma.ubicaciones.findMany();
    return result;
}

export async function obtenerUbicacion(pasillo: string, estante: string, charola: string, cajon: string) {
    const result = await prisma.ubicaciones.findFirst({
        where: {
            pasillo,
            estante,
            charola,
            cajon
        }
    });
    if (!result) {
        const error = new Error("La ubicación no existe");
        (error as any).statusCode = 404;
        (error as any).codigo = "UBICACION_NO_EXISTE";
        throw error;
    }
    return result;
}