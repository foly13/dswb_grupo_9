const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const adminMiddleware = require('../middlewares/adminMiddleware');

// OBTENER TODOS LOS USUARIOS
router.get('/', adminMiddleware, userController.getAllUsers);

// RUTA PARA CREAR UN NUEVO USUARIO
router.get('/new', adminMiddleware, userController.renderNewUserForm);

// AGREGAR UN NUEVO USUARIO
router.post('/', adminMiddleware, userController.addNewUser);

// RUTA PARA EDITAR UN USUARIO EXISTENTE
router.get('/:id/edit', adminMiddleware, userController.renderEditUserForm);

// ACTUALIZAR USUARIO
router.put('/:id', adminMiddleware, userController.updateUser);

// ELIMINAR USUARIO
router.delete('/:id', adminMiddleware, userController.deleteUser);

module.exports = router;
