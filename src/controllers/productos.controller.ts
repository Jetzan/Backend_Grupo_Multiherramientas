import {Request, Response } from "express";


import { crearProducto, obtenerProductos, obtenerProductosPorCategoria, obtenerProductosPorMarca } from "../services/productos.service";

import multer from "multer";


export async function createProduct(
    req: Request,
    res: Response,
) {
    try {

const imagenes = req.files as Express.Multer.File[];

        const result = await crearProducto(
            req.body,
            imagenes
        );


        console.log(`Producto registrado: ${result}`)
        
         return res.status(201).json({
            mensaje: "Producto creado correctamente",
            data: {
                nombre: result.producto.nombre,
                descripcion: result.producto.descripcion,
                precio: result.producto.precio
            }
        }); 

    } catch (error:any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
        
    }
}


//Obtener todos los productos
export async function getProducts(
    req: Request,
    res: Response,
) {
    try {
        const result = await obtenerProductos();
        console.log(`Productos obtenidos: ${result.length}`)
        return res.status(200).json({
            mensaje: "Productos obtenidos correctamente",
            data: result
        });
    } catch (error:any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

//Obtener productos por marca
export async function getProductsByBrand(
    req: Request,
    res: Response,
) {
    try {
        const { marca } = req.body;
        const result = await obtenerProductosPorMarca(marca);
        console.log(`Productos obtenidos por marca ${marca}: ${result.length}`)
        return res.status(200).json({
            mensaje: "Productos obtenidos correctamente",
            data: result
        });
    } catch (error:any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

//Obtener productos por categoría
export async function getProductsByCategory(
    req: Request,
    res: Response,
) {
    try {
        const { categoria } = req.body;
        const result = await obtenerProductosPorCategoria(categoria);
        console.log(`Productos obtenidos por categoria ${categoria}: ${result.length}`)
        return res.status(200).json({
            mensaje: "Productos obtenidos correctamente",
            data: result
        });
    } catch (error:any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}
