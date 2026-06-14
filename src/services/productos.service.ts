import { tipo_corriente } from "../../generated/prisma/enums";
import  {prisma} from "../../lib/prisma"
import cloudinary from "../config/cloudinary";
import multer from "multer";
import { obtenerUbicacion ,crearUbicacion} from "./ubicacion.service";

interface IProductCreate{
    nombre: string,
    modelo: string,
    descripcion: string,
    precio: number,
    existencia: number,
    marca: string,
    categoria:string,
    pasillo: string,
    estante: string,
    charola: string,
    cajon: string,
    marcaUbicacion?: string | null,
    notas?: string | null,
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



export async function crearProducto(
    producto : IProductCreate,
    imagenes: Express.Multer.File[]
){
   

    //Verificar si la ubicacion ya existe
    const ubicacionExistente = await obtenerUbicacion(
        producto.pasillo,
        producto.estante,
        producto.charola,
        producto.cajon
    ).catch(() => null);

    //Si la ubicación no existe, crearla
    let ubicacionId;
    if(!ubicacionExistente){
        const nuevaUbicacion = await crearUbicacion(
            {
                pasillo: producto.pasillo,
                estante: producto.estante,
                charola: producto.charola,
                cajon: producto.cajon,
                marca: producto.marcaUbicacion
            }
        );
        ubicacionId = nuevaUbicacion.id;
    }else{
        ubicacionId = ubicacionExistente.id;
    }
  
    const data = {
        nombre: producto.nombre,
        modelo: producto.modelo,
        descripcion: producto.descripcion,
        precio: Number(producto.precio),
        existencia: Number(producto.existencia),
        marca_id: await obtenerIdMarca(producto.marca),
        ubicacion_id: ubicacionId,
        tipo_corriente: producto.tipo_corriente,
        categoria_id: await obtenerIdCategoria(producto.categoria)
    }
    const nuevoProducto = await prisma.productos.create({
        data
    });

    // Subir imágenes y guardar registros
    for (let i = 0; i < imagenes.length; i++) {

        const imagen = imagenes[i];

        const resultado = await cloudinary.uploader.upload(
            imagen.path,
            {
                folder: "imgProductos",
                resource_type: "image"
            }
        );

        await prisma.imagenes_producto.create({
            data: {
                producto_id: nuevoProducto.id,
                alt_text:resultado.public_id,
                url: resultado.secure_url,
                orden: i,
                es_principal: i === 0
            }
        });
    }
    return {
        producto: nuevoProducto,
    };
}

//Obtener todos los productos

export async function obtenerProductos(){
    //Obtener primero el producto y luego las imagenes
    const productos = await prisma.productos.findMany();
    const productosConImagenes = await Promise.all(productos.map(async (producto) => {
        const imagenes = await prisma.imagenes_producto.findMany({where:{producto_id:producto.id},select:{url:true,es_principal:true,orden:true}});
        return {
            ...producto,
            imagenes
        }
    }));
    return productosConImagenes;
}



//Obtener productos activos
export async function obtenerProductosActivos(){
    //Obtener primero el producto y luego las imagenes
    const productos = await prisma.productos.findMany({where:{activo:true}});
    const productosConImagenes = await Promise.all(productos.map(async (producto) => {
        const imagenes = await prisma.imagenes_producto.findMany({where:{producto_id:producto.id},select:{url:true,es_principal:true,orden:true}});
        return {
            ...producto,
            imagenes
        }
    }));
    return productosConImagenes;
}








//Obtener productos por marca

export async function obtenerProductosPorMarca(marca:string){
    const marcaId = await obtenerIdMarca(marca);
    const productos = await prisma.productos.findMany({where:{marca_id:marcaId}});
    const productosConImagenes = await Promise.all(productos.map(async (producto) => {
        const imagenes = await prisma.imagenes_producto.findMany({where:{producto_id:producto.id},select:{url:true,es_principal:true,orden:true}});
        return {
            ...producto,
            imagenes
        }
    }));
    return productosConImagenes;
}

//Obtener productos por categoria

export async function obtenerProductosPorCategoria(categoria:string){
    const categoriaId = await obtenerIdCategoria(categoria);
    const productos = await prisma.productos.findMany({where:{categoria_id:categoriaId}});
    const productosConImagenes = await Promise.all(productos.map(async (producto) => {
        const imagenes = await prisma.imagenes_producto.findMany({where:{producto_id:producto.id},select:{url:true,es_principal:true,orden:true}});
        return {
            ...producto,
            imagenes
        }
    }));
    return productosConImagenes;
}



interface IProductUpdate {
    nombre: string,
    modelo: string,
    descripcion: string,
    precio: number,
    existencia: number,
    marca_id: string,
    ubicacion_id: string,
    tipo_corriente: tipo_corriente,
    categoria_id: string,
    activo: boolean,
    descontinuado: boolean
}

//Modificar producto

export async function modificarProducto(id: string, datosActualizados: Partial<IProductUpdate>) {
    const productoExistente = await prisma.productos.findUnique({ where: { id } });
    if (!productoExistente) {
        const error = new Error("Producto no encontrado");
        (error as any).statusCode = 404;
        (error as any).codigo = "PRODUCTO_NO_ENCONTRADO";
        throw error;
    }

    const productoActualizado = await prisma.productos.update({
        where: { id },
        data: { ...datosActualizados }
    });

    return productoActualizado;
}




export async function eliminarProducto(id: string) {

    const productoExistente = await prisma.productos.findUnique({ where: { id } });
    
    if (!productoExistente) {
        const error = new Error("Producto no encontrado");
        (error as any).statusCode = 404;
        (error as any).codigo = "PRODUCTO_NO_ENCONTRADO";
        throw error;
    }


    // Obtener imágenes del producto
    const imagenes = await prisma.imagenes_producto.findMany({
        where: {
            producto_id: id
        }
    });

    // Eliminar imágenes de Cloudinary
    for (const imagen of imagenes) {
        if(imagen){
            await cloudinary.uploader.destroy(
                imagen.alt_text!
            );
        }
    }

    // Eliminar registros de imágenes
    await prisma.imagenes_producto.deleteMany({
        where: {
            producto_id: id
        }
    });

    // Eliminar producto
    await prisma.productos.delete({
        where: {
            id
        }
    });

}


//Baja logica de producto

export async function bajaLogicaProducto(id: string) {
    const productoExistente = await prisma.productos.findUnique({ where: { id } });
    if (!productoExistente) {
        const error = new Error("Producto no encontrado");
        (error as any).statusCode = 404;
        (error as any).codigo = "PRODUCTO_NO_ENCONTRADO";
        throw error;
    }

    const productoActualizado = await prisma.productos.update({
        where: { id },
        data: { activo: false }
    });

    return productoActualizado;
}
