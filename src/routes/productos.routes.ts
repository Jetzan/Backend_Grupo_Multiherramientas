import { Router } from "express";
import { soloAdmin, verificarToken } from "../middlewares/auth.middleware";
import { createProduct, getProducts,getActiveProducts ,getProductsByBrand, getProductsByCategory, logicalDeleteProduct, updateProduct, searchProducts, getProductById} from "../controllers/productos.controller";
import upload from "../middlewares/imagenes";


const router = Router();

// Rutas Publicas (no requieren autenticacion)

//Obtener todos los productos
router.get("/", getProducts);

//Obtener productos activos
router.get("/activos", getActiveProducts);

//Obtener producto por ID
router.get("/:id", getProductById);


//Obbtener productos por Categoria
router.post("/productosCategoria", getProductsByCategory );

//Obtener productos por Marca
router.post("/productosMarca", getProductsByBrand);

//Rutas Protegias + usuario admin (requieren autenticacion)
//Crear producto
router.post("/", verificarToken, soloAdmin, upload.array("imagenes",10) ,createProduct);

//Baja logica de producto
router.delete("/eliminarLogico", verificarToken, soloAdmin, logicalDeleteProduct);

//Actualizar producto
router.put("/updateProduct", verificarToken, soloAdmin, updateProduct);

//Buscar productos
router.get("/buscar", searchProducts);


export default router;