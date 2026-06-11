import { tipo_corriente } from "../../generated/prisma/enums";
import  {prisma} from "../../lib/prisma"
import cloudinary from "../config/cloudinary";
import multer from "multer";

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



export async function crearProducto(
    producto : IProductCreate,
    imagenes: Express.Multer.File[]
){



   
    const data = {
        nombre: producto.nombre,
        modelo: producto.modelo,
        descripcion: producto.descripcion,
        precio: Number(producto.precio),
        existencia: Number(producto.existencia),
        marca_id: await obtenerIdMarca(producto.marca),
        ubicacion_id: producto.ubicacion_id,
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
