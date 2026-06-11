import { Request, Response } from "express";

import cloudinary from "../config/cloudinary";

import multer from "multer"

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}


export async function uploadImage(
    req: Request,
    res: Response
) {

    const filePath = req.file?.path;
    if (!filePath) {
        throw new Error("No file uploaded.");
    }
    try {

        console.log(cloudinary)
        const resultado = await cloudinary.uploader.upload(
            filePath,
            {
                folder: "imgProductos",
                resource_type: "image"
            }
        );

        res.json({
            mensaje: "Imagen subida",
            url: resultado.secure_url,
            publicId: resultado.public_id
        });

    } catch (error: any) {

        res.status(500).json({
            error: error.message
        });

    }

}
