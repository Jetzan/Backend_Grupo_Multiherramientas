import { Router } from "express";
import { changePassword, createUser, loginUser, recoverPassword } from "../controllers/usuarios.controller";


const router = Router();

router.post("/", createUser);

router.post("/login",loginUser);

router.post("/recover",recoverPassword);


router.post("/changePassword",changePassword);

export default router;