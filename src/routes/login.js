const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Página de inicio de sesión
router.get('/', (req, res) => {
  res.render('login', { title: 'Inicio de Sesión' });
});

// Procesar formulario de inicio de sesión
router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Leer usuarios desde el archivo JSON
    const usersFilePath = path.join(__dirname, '../data/users.json');
    const data = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(data);

  // Lógica de autenticación
  if (username === 'admin' && password === '1234') {
    res.redirect('/admin');
  } else {
    res.redirect('/');
  }
}catch (error) {
  console.error('Error al leer el archivo de usuarios:', error);
  res.render('login', { title: 'Inicio de Sesión', error: 'Error en el sistema, intenta más tarde' });
}});
module.exports = router;
