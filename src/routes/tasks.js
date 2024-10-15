const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

// Definir rutas y asociarlas con los métodos del controlador
router.get('/', tasksController.getAllTasks);
router.get('/:id/edit', tasksController.getEditTaskForm);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;

