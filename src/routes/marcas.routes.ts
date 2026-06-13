import { Router } from "express";
import { createBrand, getBrands,getBrandById, getBrandBySlug, deleteBrand } from "../controllers/marcas.controller";

const router = Router();

router.post("/", createBrand);

router.get("/", getBrands);

router.get("/obtenerMarcaPorId", getBrandById);

router.get("/obtenerMarcaPorSlug", getBrandBySlug);

router.delete("/eliminarMarca", deleteBrand);


export default router;