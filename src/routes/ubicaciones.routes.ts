import { Router } from "express";
import { verificarToken } from "../middlewares/auth.middleware";
import { getProductsByLocation } from "../controllers/ubicaciones.controller";

const router = Router();

//Obtener productos por ubicación
router.get("/productosPorUbicacion", verificarToken, getProductsByLocation);


export default router;

