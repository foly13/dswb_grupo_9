const express = require('express');
const router = express.Router();
let mainController = require('../controllers/mainController');

// Renderizar página de inicio de sesión
router.get('/', mainController.renderLoginPage);

// Procesar formulario de inicio de sesión
router.post('/', mainController.processLogin);

// Renderizar página Home
router.get('/home', mainController.renderHomePage);

module.exports = router;
