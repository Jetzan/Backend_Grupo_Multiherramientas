import { prisma } from "../../lib/prisma";
import generarSlug from "../utils/slug";


//Crear categoria

interface CreateCategoriaInterface {
  nombre: string,
  descripcion: string
  categoria_padre: string
}

function obtenerCategoriaPorNombre(nombre: string) {
  return prisma.categorias.findFirst({ where: { nombre } });
}



export async function crearCategoria(categoria: CreateCategoriaInterface) {


  const categoriaExistente = await obtenerCategoriaPorNombre(categoria.nombre);

  if (categoriaExistente) {
    const error = new Error("La categoria ya existe");
    (error as any).statusCode = 409;
    (error as any).codigo = "CATEGORIA_EXISTE";
    throw error;
  }


  let idCategoriaPadre: string | null = null;

  if (categoria.categoria_padre) {

    const categoriaPadre = await obtenerCategoriaPorNombre(categoria.categoria_padre);

    if (!categoriaPadre) {
      const error = new Error("La categoria padre no existe");
      (error as any).statusCode = 404;
      (error as any).codigo = "CATEGORIA_PADRE_NO_EXISTE";
      throw error;
    }

    idCategoriaPadre = categoriaPadre.id;
  }

  const result = await prisma.categorias.create({
    data: {
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      slug: generarSlug(categoria.nombre),
      categoria_padre_id: idCategoriaPadre

    }
  });

  return result;
}


//Obtener categorias

export async function obtenerCategorias() {
  const result = await prisma.categorias.findMany();
  return result;
}

//Obtener categoria por id

export async function obtenerCategoriaPorId(id: string) {
  const result = await prisma.categorias.findUnique({ where: { id } });
  if (!result) {
    const error = new Error("La categoria no existe");
    (error as any).statusCode = 404;
    (error as any).codigo = "CATEGORIA_NO_EXISTE";
    throw error;
  }
  return result;
}


//Obtener categoria por slug

export async function obtenerCategoriaPorSlug(slug: string) {
  const result = await prisma.categorias.findFirst({ where: { slug } });
  if (!result) {
    const error = new Error("La categoria no existe");
    (error as any).statusCode = 404;
    (error as any).codigo = "CATEGORIA_NO_EXISTE";
    throw error;
  }
  return result;
}

//Eliminar categoria

export async function eliminarCategoria(id: string) {

  const categoria = await obtenerCategoriaPorId(id);
  if (!categoria) {
    const error = new Error("La categoria no existe");
    (error as any).statusCode = 404;
    (error as any).codigo = "CATEGORIA_NO_EXISTE";
    throw error;
  }

  await prisma.categorias.delete({ where: { id } });
  return { message: "Categoria eliminada correctamente" };
}




