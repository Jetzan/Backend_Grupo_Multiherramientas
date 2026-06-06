import { Router } from "express";
import { getCategories } from "../controllers/categoria.controller";

const router = Router();

router.get("/", getCategories);

export default router;