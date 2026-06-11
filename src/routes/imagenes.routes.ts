import { Router } from "express";

import { uploadImage } from "../controllers/imagenes.controller";

import upload from "../middlewares/imagenes";

const router = Router();

router.post("/",upload.single("imagen"),uploadImage)
export default router;