import express from 'express';
import categoriasRoutes from './routes/categoria.routes'
import usuariosRoutes from './routes/users.routes'

const app = express();

app.use(express.json());

app.use('/categorias', categoriasRoutes);
app.use("/usuarios",usuariosRoutes);    


export default app;