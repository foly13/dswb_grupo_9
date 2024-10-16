const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');


// Ruta para ver los detalles de una tarea
router.get('/:id', tasksController.showTaskDetails);
router.get('/:id/edit', tasksController.getEditTaskForm);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

// Definir rutas y asociarlas con los métodos del controlador
router.get('/', tasksController.getAllTasks);
module.exports = router;

