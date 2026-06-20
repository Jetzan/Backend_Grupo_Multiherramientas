import { Router } from "express";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { getProductsByLocation } from "../controllers/ubicaciones.controller.js";

const router = Router();

//Obtener productos por ubicación
router.post("/productosPorUbicacion", verificarToken, getProductsByLocation);


export default router;

