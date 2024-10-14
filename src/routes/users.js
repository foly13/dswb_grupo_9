const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const usersFilePath = path.join(__dirname, '../users.json');

// Leer usuarios del archivo
const getUsers = async () => {
  const data = await fs.promises.readFile(usersFilePath, 'utf-8');
  return JSON.parse(data);
};


// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await getUsers();
    res.render('users', { users });
  } catch (error) {
    res.status(500).send('Error al obtener los usuarios');
  }
});


// Agregar un nuevo usuario
router.post('/', (req, res) => {
  try {
    const users = getUsers();
    const newUser = req.body;

    // Validación básica
    if (!newUser.id || !newUser.nombre || !newUser.area || !newUser.contraseña) {
      return res.status(400).send('Faltan campos requeridos');
    }

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.status(201).send('Usuario agregado');
  } catch (error) {
    console.error('Error al agregar usuario:', error); // Muestra el error en la consola
    res.status(500).send('Error al agregar el usuario');
  }
});


module.exports = router;
