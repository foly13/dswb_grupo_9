const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

// Rutas para ver listado de tareas y formulario de nueva tarea
router.get('/', tasksController.getAllTasks);
router.get('/new-task', tasksController.getNewTaskForm);

// Ruta para crear una nueva tarea
router.post('/', tasksController.createTask);

// Rutas para ver, editar y eliminar los detalles de una tarea
router.get('/:id', tasksController.showTaskDetails);
router.get('/:id/edit', tasksController.getEditTaskForm);
router.put('/:id', tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
