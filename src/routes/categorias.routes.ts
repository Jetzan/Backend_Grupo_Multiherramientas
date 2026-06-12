import { Router } from "express";
import { createCategory, getCategorys,getCategoryById, getCategoryBySlug, deleteCategory } from "../controllers/categoria.controller";

const router = Router();

router.post("/", createCategory);

router.get("/", getCategorys);

router.get("/obtenerCategoriaPorId", getCategoryById);

router.get("/obtenerCategoriaPorSlug", getCategoryBySlug);

router.delete("/eliminarCategoria", deleteCategory);


export default router;