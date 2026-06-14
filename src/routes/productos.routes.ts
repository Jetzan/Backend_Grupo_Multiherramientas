import { Router } from "express";
import { createProduct, getProducts,getActiveProducts ,getProductsByBrand, getProductsByCategory, logicalDeleteProduct, updateProduct} from "../controllers/productos.controller";
import upload from "../middlewares/imagenes";


const router = Router();


//Crear producto
router.post("/",upload.array("imagenes",10) ,createProduct);

//Obtener todos los productos
router.get("/", getProducts);

//Obtener productos activos
router.get("/activos", getActiveProducts);


//Obbtener productos por Categoria
router.get("/productosCategoria", getProductsByCategory );


//Obtener productos por Marca
router.get("/productosMarca", getProductsByBrand);

//Baja logica de producto
router.delete("/eliminarLogico", logicalDeleteProduct);

//Actualizar producto
router.put("/updateProduct", updateProduct);


export default router;