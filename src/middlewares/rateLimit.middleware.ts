import rateLimit from "express-rate-limit";

//Para rutas generales
export const limitadorGeneral = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutos
    max: 100, //Limite de 100 solicitudes por IP cada 15 minutos
    message: {
        codigo: "DEMASIDAAS PETICIONES",
        error: "Demasiadas pticiones, intenta mas tarde",
    }
});


// Mas stricto para login y recuperacion de contraseña (evita fuerza bruta)
export const limitadorAuth = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutos
    max: 10, //Limite 10 solicitudes por IP cada 15 minutos
    message: {
        codigo: "DEMASIADOS INTENTOS",
        mensaje: "Demasiados intentos, espera 15 minutos antes de volver a intentar"
    }
});