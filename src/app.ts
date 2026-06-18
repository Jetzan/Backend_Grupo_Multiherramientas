import express from 'express';
// Importar rutas de cada módulo
import categoriasRoutes from './routes/categorias.routes'
import usuariosRoutes from './routes/usuarios.routes'
import productosRoutes from './routes/productos.routes'
import marcasRoutes from './routes/marcas.routes';
import ubicacionesRoutes from './routes/ubicaciones.routes';
import noticiasRoutes from './routes/noticias.routes';
import cors from 'cors';
import helmet from 'helmet'; // evita clickjacking, sniffing, XSS y otras vulnerabilidades relacionadas con las cabeceras HTTP
import { limitadorGeneral } from './middlewares/rateLimit.middleware'; //Limita las peticiones}

const app = express();
app.use(helmet()); // Agrega Helmet para mejorar la seguridad de las cabeceras HTTP
app.use( limitadorGeneral); // Aplica el limitador de peticiones a todas las rutas

// Configurar CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Parsear JSON en las solicitudes
app.use(express.json({limit: "1mb"})); // Limita cuerpo JSON para evitar abuso de memoria

// Definir rutas de la API
app.use('/categorias', categoriasRoutes);
app.use("/usuarios",usuariosRoutes);    
app.use("/productos",productosRoutes);
app.use("/marcas",marcasRoutes),
app.use("/ubicaciones",ubicacionesRoutes);
app.use("/noticias",noticiasRoutes);

export default app;