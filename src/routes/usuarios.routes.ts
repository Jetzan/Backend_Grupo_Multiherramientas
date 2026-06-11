import { Router } from "express";
import { changePassword, createUser, loginUser, recoverPassword } from "../controllers/usuarios.controller";


const router = Router();


//Crear Usuario
router.post("/", createUser);


//Hacer login
router.post("/login",loginUser);


//Recuperar contraseña
//Mandar email 
router.post("/recover",recoverPassword);
//Cambiar la contraseña
router.post("/changePassword",changePassword);

export default router;