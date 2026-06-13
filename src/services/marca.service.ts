import { prisma } from "../../lib/prisma";
import generarSlug from "../utils/slug";

//Crear marca

interface createMarcaInterface {
  nombre: string,
  descripcion: string
}


async function obtenerMarcaPorNombre(nombre: string) {
  return await prisma.marcas.findFirst({ where: { nombre } });
}




export async function obtenerMarcaPorId(id: string) {
  return await prisma.marcas.findFirst({ where: { id } });
}




// Crear Marca 
export async function crearMarca(marca: createMarcaInterface) {

  const marcaExistente = await obtenerMarcaPorNombre(marca.nombre);

  if (marcaExistente) {
    const error = new Error("La marca ya existe");
    (error as any).statusCode = 409;
    (error as any).codigo = "MARCA_EXISTE";
    throw error;
  }

  const result = await prisma.marcas.create({
    data: {
      nombre: marca.nombre,
      descripcion: marca.descripcion,
      slug: generarSlug(marca.nombre),
    }
  });

  return result;
}


//Obtener Marcas

export async function obtenerMarcas() {
  const result = await prisma.marcas.findMany();
  return result;
}


//Obtener marca por slug

export async function obtenerMarcaPorSlug(slug: string) {
  const result = await prisma.marcas.findFirst({ where: { slug } });
  if (!result) {
    const error = new Error("La marca no existe");
    (error as any).statusCode = 404;
    (error as any).codigo = "MARCA_NO_EXISTE";
    throw error;
  }
  return result;
}




//Eliminar Marca
export async function eliminarMarca(id: string) {

  const marca = await obtenerMarcaPorId(id);
  if (!marca) {
    const error = new Error("La marca no existe");
    (error as any).statusCode = 404;
    (error as any).codigo = "MARCA_NO_EXISTE";
    throw error;
  }

  await prisma.marcas.delete({ where: { id } });
  return { message: "Marca eliminada correctamente" };
}
