import express from 'express';
import categoriasRoutes from './routes/categorias.routes'
import usuariosRoutes from './routes/usuarios.routes'
import productosRoutes from './routes/productos.routes'
import marcasRoutes from './routes/marcas.routes';
import cors from 'cors';

const app = express();


//Permitir pruebas locales con localhost y el frontend de github pages
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));

// app.use(cors({
//     origin: ["http://localhost:5173","PAGINA_WEB"],
//     credentials: true
// }));

app.use(express.json());


app.use('/categorias', categoriasRoutes);
app.use("/usuarios",usuariosRoutes);    
app.use("/productos",productosRoutes);
app.use("/marcas",marcasRoutes)


export default app;