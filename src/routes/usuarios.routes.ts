import { Router } from "express";
import { verificarToken, soloAdmin, verificarTokenRecuperacion } from "../middlewares/auth.middleware.js";
import { changePassword, createUser, loginUser, recoverPassword } from "../controllers/usuarios.controller.js";
import { limitadorAuth } from '../middlewares/rateLimit.middleware.js';

const router = Router();


//Ruta solo admin
//Crear Usuario
router.post("/", createUser);


//Rutas Publicas (no requieren autenticacion)
//Hacer login
router.post("/login", limitadorAuth,loginUser);

//Recuperar contraseña
//Mandar email 
router.post("/recover", limitadorAuth,recoverPassword);
//Cambiar la contraseña
router.post("/changePassword", verificarTokenRecuperacion, limitadorAuth,changePassword);

export default router;