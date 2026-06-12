import { Request, Response } from "express";

import { crearCategoria, obtenerCategorias, obtenerCategoriaPorId, obtenerCategoriaPorSlug, eliminarCategoria } from "../services/categoria.service";


//Crear categoria

export async function createCategory(req: Request, res: Response) {
    const { nombre, descripcion, categoria_padre } = req.body;
    try {
        const categoria = await crearCategoria({ nombre, descripcion, categoria_padre });
        res.status(201).json(categoria);
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}


//Obtener categorias

export async function getCategorys(req: Request, res: Response) {
    try {
        const categorias = await obtenerCategorias();
        res.status(200).json(categorias);
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

//Obtener categoria por id
export async function getCategoryById(req: Request, res: Response) {
    const { id } = req.body;
    try {
        const categoria = await obtenerCategoriaPorId(id);
        res.status(200).json(categoria);
    }catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

//Obtener categoria por slug
export async function getCategoryBySlug(req: Request, res: Response) {
    const { slug } = req.body;
    try {
        const categoria = await obtenerCategoriaPorSlug(slug);
        res.status(200).json(categoria);
    }catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

//Eliminar categoria
export async function deleteCategory(req: Request, res: Response) {
    const { id } = req.body;
    try {
        const result = await eliminarCategoria(id);
        res.status(200).json(result);
    }catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

