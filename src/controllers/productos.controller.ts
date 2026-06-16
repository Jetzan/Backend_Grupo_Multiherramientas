import { Request, Response } from "express";


import { crearProducto, obtenerProductos, obtenerProductosActivos, obtenerProductosPorCategoria, obtenerProductosPorMarca, bajaLogicaProducto, modificarProducto, buscarProductos } from "../services/productos.service";

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

    } catch (error: any) {
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
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

//Obtener productos activos
export async function getActiveProducts(
    req: Request,
    res: Response,
) {
    try {
        const result = await obtenerProductosActivos();
        console.log(`Productos activos obtenidos: ${result.length}`)
        return res.status(200).json({
            mensaje: "Productos activos obtenidos correctamente",
            data: result
        });
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

//Editar producto
export async function updateProduct(
    req: Request,
    res: Response,
) {
    console.log("wasd");
    try {
        console.log(req);
        console.log("...");
        console.log(req.body);
        
        const { id,
            nombre,
            modelo,
            descripcion,
            precio,
            existencia,
            marca_id,
            ubicacion_id,
            tipo_corriente,
            categoria_id,
            activo,
            descontinuado,
        } = req.body;
        const result = await modificarProducto(id, {
            nombre,
            modelo,
            descripcion,
            precio,
            existencia,
            marca_id,
            ubicacion_id,
            tipo_corriente,
            categoria_id,
            activo,
            descontinuado,
        });
        console.log(`Producto actualizado: ${result}`)
        return res.status(200).json({
            mensaje: "Producto actualizado correctamente",
            data: result
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

//Baja lógica de producto
export async function logicalDeleteProduct(
    req: Request,
    res: Response,
) {
    try {
        const { id } = req.body;
        const result = await bajaLogicaProducto(id);
        console.log(`Producto dado de baja lógicamente: ${result}`)
        return res.status(200).json({
            mensaje: "Producto dado de baja lógicamente correctamente",
            data: result
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}


//Buscar productos que contienen cierta cadena en su nombre o descripción
export async function searchProducts(
    req: Request,
    res: Response,
) {
    try {
        const { query } = req.body;
        const result = await buscarProductos(query);
        return res.status(200).json({
            mensaje: "Productos encontrados correctamente",
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
