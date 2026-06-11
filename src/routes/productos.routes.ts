import { Router } from "express";
import { createProduct, getProducts, getProductsByBrand, getProductsByCategory } from "../controllers/productos.controller";
import upload from "../middlewares/imagenes";


const router = Router();


//Crear producto
router.post("/",upload.array("imagenes",10) ,createProduct);

//Obtener todos los productos
router.get("/", getProducts);

//Obbtener productos por Categoria
router.get("/productosCategoria", getProductsByCategory );


//Obtener productos por Marca
router.get("/productosMarca", getProductsByBrand);



export default router;