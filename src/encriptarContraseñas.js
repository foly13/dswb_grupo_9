const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/users'); // Ruta correcta según tu proyecto

// Conectar a la base de datos
mongoose.connect('mongodb+srv://grupo9:BackEnd@gestortareasdb.ie1iz.mongodb.net/?retryWrites=true&w=majority&appName=GestorTareasDB')
  .then(() => {
    console.log('Conectado a la base de datos');
    return updatePasswords(); // Llamamos a la función para actualizar contraseñas
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos', error);
  });

async function updatePasswords() {
  try {
    const users = await User.find(); // Obtener todos los usuarios

    // Recorrer todos los usuarios
    for (let user of users) {
      if (user.contraseña && !user.contraseña.startsWith('$2a$')) {  // Si la contraseña no está cifrada
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.contraseña, salt); // Ciframos la contraseña
        user.contraseña = hashedPassword;
        await user.save(); // Guardamos el usuario con la nueva contraseña cifrada
        console.log(`Contraseña cifrada para el usuario ${user.nombre}`);
      }
    }

    console.log('Proceso de actualización de contraseñas completado.');
    process.exit(); // Cerramos la conexión a la base de datos
  } catch (error) {
    console.error('Error al actualizar las contraseñas', error);
    process.exit(1);
  }
}
