require('dotenv').config(); // Cargar las variables de entorno
const mongoose = require('mongoose');

// Obtener la URI de conexión desde el archivo .env
const uri = process.env.MONGODB_URI;

// Función para conectar a la base de datos
async function connectDB() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error);
    process.exit(1); // Finaliza la aplicación si la conexión falla
  }
}

// Llamar a la función de conexión
connectDB();

module.exports = mongoose; // Exporta la conexión si necesitas usarla en otro archivo
module.exports = connectDB;
