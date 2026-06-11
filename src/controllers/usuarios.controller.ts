import { Request, Response } from "express";

import { cambiarPassword, iniciarSesion, recuperarPassword, registrarUsuario } from "../services/usuario.service";


import nodemailer from "nodemailer";

import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com", // El servidor de Brevo
    port: 587,                    // El puerto de Brevo
    secure: false,                // False porque usamos el puerto 587
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
    }
});


async function enviarCorreo(correo: string) {
    console.log(correo);

    try {
        const info = await transporter.sendMail({

            from: '"Mi Servidor Node" <grupomultiherramientas@hotmail.com>',
            to: correo,
            subject: 'Recuperación de contraseña',
            html: '<h3>Recuperar contraseña</h3><a>Haz click aqui para recuperar tu contraseña de Grupo Multiherramientas</a>'
        }
        )
        console.log('✅ ¡Correos enviados con éxito!');
        console.log('ID del mensaje Brevo:', info.messageId);

    } catch (error) {
        console.error('❌ Error completo:', error);
    }
}





export async function createUser(
    req: Request,
    res: Response
) {
    try {

        const result = await registrarUsuario(req.body);

        console.log(`Usuario registrado: ${result}`);

        return res.status(201).json({
            mensaje: "Usuario creado correctamente",
            data: {
                nombre: result.nombre,
                email: result.email,
                rol: result.rol
            }
        });

    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}

interface IUsuarioJWT {
    id: string,
    email: string,
    rol: string
}


function generarJWT(usuario: IUsuarioJWT) {
    return jwt.sign(
        {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        },
        process.env.JWT_SECRET!,
        {
            expiresIn: "1h"
        }
    )
}



export async function loginUser(
    req: Request,
    res: Response
) {
    try {
        const result = await iniciarSesion(req.body);


        const token = generarJWT({
            id: result.id,
            email: result.email,
            rol: result.rol
        })

        return res.status(200).json({

            mensaje: "Inicio de sesión exitoso",
            token,
            data: result
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}
export async function recoverPassword(
    req: Request,
    res: Response
) {
    try {
        const result = await recuperarPassword(req.body.correo);
        const token = generarJWT({
            id: result.id,
            email: result.email,
            rol: result.rol
        });
        enviarCorreo(result.email);
        return res.status(200).json({
            mensaje: "Correo enviado",
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        })
    }
}
export async function changePassword(
    req: Request,
    res: Response
) {
    try {
        const result = await cambiarPassword({ correo: req.body.correo, password: req.body.password });

        return res.status(200).json({
            mensaje: "Contraseña cambiada correctamente",
        });
    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        });
    }

}