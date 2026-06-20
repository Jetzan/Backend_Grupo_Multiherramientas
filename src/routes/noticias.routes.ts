import { Router } from "express";
import { createNotice, getNotices, getNoticeById, getPublishedNotices, deleteNoticeById, updateNoticeById } from "../controllers/noticias.controller.js";
import upload from "../middlewares/imagenes.js";

const router = Router();

router.post("/", upload.single("imagen"), createNotice);
router.get("/", getNotices);
router.get("/publicadas", getPublishedNotices);
router.delete("/eliminarNoticia", deleteNoticeById);

router.put("/actualizarNoticia", updateNoticeById);
router.get("/:id", getNoticeById);

export default router;