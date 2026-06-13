import express from 'express';
import categoriasRoutes from './routes/categorias.routes'
import usuariosRoutes from './routes/usuarios.routes'
import productosRoutes from './routes/productos.routes'
import marcasRoutes from './routes/marcas.routes';

const app = express();

app.use(express.json());

app.use('/categorias', categoriasRoutes);
app.use("/usuarios",usuariosRoutes);    
app.use("/productos",productosRoutes);
app.use("/marcas",marcasRoutes)


export default app;