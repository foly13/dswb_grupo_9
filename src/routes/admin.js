const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ruta para la página del panel de administración
router.get('/', (req, res) => {
  res.render('admin', { title: 'Panel de Administración' });
});

// Ruta para procesar el formulario y agregar empleados
router.post('/add-employee', (req, res) => {
  const { nombre, area, contraseña } = req.body;

  // Ruta del archivo users.json
  const usersFilePath = path.join(__dirname, '../data/users.json');

  // Leer el archivo users.json
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      return res.status(500).send('Error al leer los usuarios');
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
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error('Error al escribir el archivo:', err);
        return res.status(500).send('Error al guardar el usuario');
      }

      // Redirigir al panel de administración con un mensaje de éxito
      res.redirect('/admin');
    });
  });
});

module.exports = router;
