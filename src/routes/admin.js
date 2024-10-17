const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Ruta para la página del panel de administración
router.get('/', (req, res) => {
  res.render('admin', { title: 'Panel de Administración' });
});

// Ruta para procesar el formulario y agregar empleados
router.post('/add-employee', async (req, res) => {
  const { nombre, area, contraseña } = req.body;

  // Ruta del archivo users.json
  const usersFilePath = path.join(__dirname, '../data/users.json');
  try {
  // Leer el archivo users.json
  let data;
    try {
      data = await fs.readFile(usersFilePath, { encoding: 'utf8' });
    } catch (err) {
      // Si no existe el archivo o está vacío, iniciamos una lista vacía
      if (err.code === 'ENOENT') {
        data = '[]';
      } else {
        throw err; // Si es otro tipo de error, lo lanzamos
      }
    }

    // Convertir el contenido del archivo en un objeto JSON
    let users = JSON.parse(data || '[]');

    // Crear un nuevo usuario
    const newUser = {
      id: users.length + 1, 
      nombre,
      area,
      contraseña
    };

    // Agregar el nuevo usuario a la lista de usuarios
    users.push(newUser);

    // Escribir los nuevos datos en el archivo
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

      // Redirigir al panel de administración con un mensaje de éxito
      res.redirect('/admin');
  } catch (err) {
    console.error('Error al manejar el archivo de usuarios:', err);
    res.status(500).send('Error en el sistema. Intente más tarde.');
  }
});
module.exports = router;
