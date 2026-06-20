import { Request, Response } from "express";
import { RequestConUsuario } from "../middlewares/auth.middleware.js";
import { cambiarPassword, iniciarSesion, recuperarPassword, registrarUsuario } from "../services/usuario.service.js";


import nodemailer from "nodemailer";

import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,        // ← cambia a 587
  secure: false,    // ← false para 587 (usa STARTTLS)
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS
  },
  connectionTimeout: 8000,
  socketTimeout: 8000
});


async function enviarCorreo(correo: string, token: string) {
    console.log(correo);
    const linkRecuperacion = `${process.env.FRONTEND_URL}/Frontend_Grupo_Multiherramientas/reset-password?token=${token}`;

    try {
        const info = await transporter.sendMail({

            from: `"Grupo Multiherramientas" <${process.env.BREVO_SENDER}>`,
            to: correo,
            subject: 'Recuperación de contraseña',
            html: `
                <h3>Recuperar contraseña</h3>
                <p>Haz click en el siguiente enlace para cambiar tu contraseña.</p>
                <p><strong>El enlace expira en 15 minutos.</strong></p>
                <a href="${linkRecuperacion}">Cambiar contraseña</a>
                <p>Si no solicitaste esto, ignora este correo.</p>
            `
        }
        )
        console.log('✅ ¡Correos enviados con éxito!');
        console.log('ID del mensaje Brevo:', info.messageId);
        return info;
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

//Helper separado para el token de recperacion de contraseña, con expiracion mas corta
function generarTokenRecuperacion(usuario: IUsuarioJWT){
    return jwt.sign({
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        proposito: "recuperar_contraseña" //Diferenciacion del token login

    }, process.env.JWT_SECRET!, {
        expiresIn: "15m" //Token de recuperacion expira en 15 minutos
    });
}

export async function recoverPassword(
    req: Request,
    res: Response
) {
    try {
        const result = await recuperarPassword(req.body.correo);
        const token = generarTokenRecuperacion({
            id: result.id,
            email: result.email,
            rol: result.rol
        });
        
        const resCorreo = await enviarCorreo(result.email, token);
        console.log(resCorreo);
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
        const { password } = req.body;
        
        // El correo viene del token verificado, no del body
        const correo = (req as RequestConUsuario).usuario!.email;

        if (!password || password.length < 8) {
            return res.status(400).json({
                codigo: "PASSWORD_INVALIDO",
                mensaje: "La contraseña debe tener al menos 8 caracteres"
            });
        }

        await cambiarPassword({ correo, password });

        return res.status(200).json({
            mensaje: "Contraseña cambiada correctamente"
        });

    } catch (error: any) {
        return res.status(error.statusCode || 500).json({
            codigo: error.codigo,
            mensaje: error.message
        });
    }
}