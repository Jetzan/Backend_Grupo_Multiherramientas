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
  const linkRecuperacion = `${process.env.FRONTEND_URL}/Frontend_Grupo_Multiherramientas/reset-password?token=${token}`;
    console.log( `${process.env.FRONTEND_URL}/Frontend_Grupo_Multiherramientas/reset-password?token=${token}`);
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Grupo Multiherramientas", email: process.env.BREVO_SENDER },
      to: [{ email: correo }],
      subject: "Recuperación de contraseña",
      htmlContent: `<h3>Recuperar contraseña</h3>
        <a href="${linkRecuperacion}">Cambiar contraseña</a>`
    }),
  });
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