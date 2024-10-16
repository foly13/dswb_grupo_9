const express = require('express');
const router = express.Router();

// Página de inicio de sesión
router.get('/', (req, res) => {
  res.render('login', { title: 'Inicio de Sesión' });
});

// Procesar formulario de inicio de sesión
router.post('/', (req, res) => {
  const { username, password } = req.body;

  // Lógica de autenticación
  if (username === 'admin' && password === '1234') {
    res.redirect('/admin');
  } else {
    res.redirect('/');
  }
});

module.exports = router;
