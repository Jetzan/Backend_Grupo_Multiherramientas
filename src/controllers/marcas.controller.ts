import { Request, Response } from "express";


import { crearMarca, obtenerMarcaPorSlug, obtenerMarcas, eliminarMarca, obtenerMarcaPorId } from "../services/marca.service";





//Crear categoria

export async function createBrand(req: Request, res: Response) {
    const { nombre, descripcion } = req.body;
    try {
        const marca = await crearMarca({ nombre, descripcion });
        res.status(201).json(marca);
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}


//Obtener marcas

export async function getBrands(req: Request, res: Response) {
    try {
        const marcas = await obtenerMarcas();
        res.status(200).json(marcas);
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

//Obtener marca por id
export async function getBrandById(req: Request, res: Response) {
    const { id } = req.body;
    try {
        const marca = await obtenerMarcaPorId(id);
        res.status(200).json(marca);
    }catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

//Obtener marca por slug
export async function getBrandBySlug(req: Request, res: Response) {
    const { slug } = req.body;
    try {
        const marca = await obtenerMarcaPorSlug(slug);
        res.status(200).json(marca);
    }catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

//Eliminar categoria
export async function deleteBrand(req: Request, res: Response) {
    const { id } = req.body;
    try {
        const result = await eliminarMarca(id);
        res.status(200).json(result);
    }catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

