import app from './app';

// Puerto en el que escucha el servidor
const PORT = 3000;

// Iniciar servidor
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})
