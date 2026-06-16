import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Interfaz extendida de Request para incluir información del usuario autenticado
 * Se usa después de verificarToken() para acceder a req.usuario
 */
export interface RequestConUsuario extends Request {
    usuario?: {
        id: string;
        email: string;
        rol: string;
    };    
}

/**
 * Middleware: Verifica que el token JWT sea válido y extrae la información del usuario
 * - Obtiene el token del header "Authorization: Bearer <token>"
 * - Valida el token usando JWT_SECRET
 * - Asigna los datos del usuario a req.usuario para uso en controladores
 * - Si el token es inválido o no existe, retorna error 401
 */
export function verificarToken(
    req: RequestConUsuario,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers['authorization'];

    // Validar que el header Authorization exista y tenga formato "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({
            codigo: "Token no proporcionado o formato incorrecto",
            mensaje: "Se requiere un token de autenticacion",
        });
    }

    // Extraer el token (después de "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // Verificar y decodificar el token
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
            rol: string;
        };

        // Asignar información del usuario al request
        req.usuario = {
            id: payload.id,
            email: payload.email,
            rol: payload.rol,
        };

        // Continuar al siguiente middleware/controlador
        next();

    } catch (error) {
        // Token inválido, expirado o malformado
        return res.status(401).json({
            codigo: "Token invalido",
            mensaje: "El token proporcionado no es valido o expiro",
        });
    }
}

/**
 * Middleware: Verifica que el usuario tenga rol de admin o superadmin
 * Debe usarse DESPUÉS de verificarToken() en la cadena de middlewares
 * Ejemplo: router.delete('/usuarios/:id', verificarToken, soloAdmin, controlador)
 */
export function soloAdmin(
    req: RequestConUsuario,
    res: Response,
    next: NextFunction
) {
    // Verificar que el usuario esté autenticado
    if (!req.usuario){
        return res.status(401).json({
            codigo: "Usuario no autenticado",
            mensaje: "Se requiere autenticacion para acceder a este recurso",
        });
    }

    // Roles con permisos administrativos
    const rolesPermitidos = ['admin', 'superadmin'];

    // Verificar que el rol del usuario sea admin o superadmin
    if(!rolesPermitidos.includes(req.usuario.rol)){
        return res.status(403).json({
            codigo: "Acceso denegado",
            mensaje: "No tienes permisos para acceder a este recurso",
        });
    }

    // Usuario tiene permisos, continuar
    next();
}

// Verifica específicamente tokens de recuperación de contraseña
export function verificarTokenRecuperacion(
    req: RequestConUsuario,
    res: Response,
    next: NextFunction
) {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({
            codigo: "TOKEN_REQUERIDO",
            mensaje: "Se requiere el token de recuperación"
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: string;
            email: string;
            rol: string;
            proposito: string;
        };

        // Verifica que sea un token de recuperación y no uno de login
        if (payload.proposito !== "recuperar_contraseña") {
            return res.status(401).json({
                codigo: "TOKEN_INVALIDO",
                mensaje: "El token no es válido para esta operación"
            });
        }

        req.usuario = payload;
        next();

    } catch (error) {
        return res.status(401).json({
            codigo: "TOKEN_EXPIRADO",
            mensaje: "El token expiró o no es válido, solicita uno nuevo"
        });
    }
}