import { tipo_corriente } from "../../generated/prisma/enums";
import  {prisma} from "../../lib/prisma"


interface IProductCreate{
    nombre: string,
    modelo: string,
    descripcion: string,
    precio: number,
    existencia: number,
    marca: string,
    categoria:string,
    ubicacion_id:string,
    tipo_corriente: tipo_corriente,

}


async function obtenerIdCategoria(categoria:string){
    const result = await prisma.categorias.findFirst({where:{nombre:categoria}});
    if(!result){
        const error = new Error("La categoria no existe");
        (error as any).statusCode = 404;
        (error as any).codigo = "CATEGORIA_NO_EXISTE";
        throw error;
    }
    return result.id;
}

async function obtenerIdMarca(marca:string){
    const result = await prisma.marcas.findFirst({where:{nombre:marca}});
    if(!result){
        const error = new Error("La marca no existe");
        (error as any).statusCode = 404;
        (error as any).codigo = "MARCA_NO_EXISTE";
        throw error;
    }
    return result.id;
}



async function crearProducto(producto : IProductCreate){

    const data = {
        nombre: producto.nombre,
        modelo: producto.modelo,
        descripcion: producto.descripcion,
        precio: producto.precio,
        existencia: producto.existencia,
        marca_id: await obtenerIdMarca(producto.marca),
        ubicacion_id: producto.ubicacion_id,
        tipo_corriente: producto.tipo_corriente,
        categoria_id: await obtenerIdCategoria(producto.categoria)
    }

    const result = await prisma.productos.create({
        data
    });
    return result;
}