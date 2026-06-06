import { Request, Response } from "express";

import { obtenerCategorias } from "../services/categoria.service";

export async function getCategories(
    req:Request,
    res:Response
){
    try {
        const categorias = await obtenerCategorias();
        console.log(categorias);
            
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({
            mensaje:"Error interno del servidor"
        })
    }
}