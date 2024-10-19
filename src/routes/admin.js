const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Ruta para la página del panel de administración
router.get('/', adminController.renderAdminPage);

module.exports = router;
