const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const tasksFilePath = path.join(__dirname, '../data/tasks.json');

// Función para obtener las tareas del archivo JSON
const getTasks = async () => {
	const data = await fs.readFile(tasksFilePath, 'utf-8'); // Leemos el archivo de manera asincrónica
	return JSON.parse(data); // Parseamos el JSON y lo retornamos
};

// Ruta para obtener todas las tareas
router.get('/', async (req, res) => {
	try {
		const tasks = await getTasks();
		const message = req.query.message; // Capturamos el mensaje de la query
		res.render('tasks', { tasks, message }); // Enviamos el mensaje a la vista
	} catch (error) {
		res.status(500).send('Error al obtener las tareas');
	}
});
/*
router.post('/:id', async (req, res) => {
	try {
		const tasks = await getTasks();
		const taskIndex = tasks.findIndex(
			(task) => task.id === parseInt(req.params.id)
		);

		if (taskIndex !== -1) {
			tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
			await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
			res.redirect('/tasks?message=Tarea actualizada'); // Redirigir con un mensaje
		} else {
			res.status(404).send('Tarea no encontrada');
		}
	} catch (error) {
		res.status(500).send('Error al actualizar la tarea');
	}
});
*/
// Ruta para mostrar el formulario de edición de una tarea
router.get('/:id/edit', async (req, res) => {
	try {
		const tasks = await getTasks(); // Leemos las tareas
		const task = tasks.find((task) => task.id === parseInt(req.params.id)); // Buscamos la tarea

		if (task) {
			res.render('edit-task', { task }); // Renderizamos la vista de edición
		} else {
			res.status(404).send('Tarea no encontrada'); // Si no se encuentra la tarea
		}
	} catch (error) {
		res.status(500).send('Error al obtener la tarea para editar'); // Manejo de errores
	}
});

// Ruta para actualizar una tarea (usando PUT)
router.put('/:id', async (req, res) => {
	try {
	  const tasks = await getTasks(); 
	  const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));
  
	  if (taskIndex !== -1) {
		tasks[taskIndex] = { ...tasks[taskIndex], ...req.body }; 
		await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2)); 
		res.redirect('/tasks?message=Tarea actualizada con éxito');
	  } else {
		res.status(404).send('Tarea no encontrada');
	  }
	} catch (error) {
	  res.status(500).send('Error al actualizar la tarea');
	}
  });

// Ruta para eliminar una tarea
router.delete('/:id', async (req, res) => {
    try {
        const tasks = await fs.readFile(tasksFilePath, 'utf-8');
        const parsedTasks = JSON.parse(tasks);
        const newTasks = parsedTasks.filter((task) => task.id !== parseInt(req.params.id));

        if (newTasks.length !== parsedTasks.length) {
            await fs.writeFile(tasksFilePath, JSON.stringify(newTasks, null, 2));
            res.redirect('/tasks?message=Tarea eliminada'); // Redirige a la vista de tareas después de eliminar
        } else {
            res.status(404).send('Tarea no encontrada');
        }
    } catch (error) {
        res.status(500).send('Error al eliminar la tarea');
    }
});
  

module.exports = router;
