const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const tasksFilePath = path.join(__dirname, '../data/tasks.json');
const usersFilePath = path.join(__dirname, '../data/users.json');
const prioritiesFilePath = path.join(__dirname, '../data/priorities.json');
const statusesFilePath = path.join(__dirname, '../data/statuses.json');


// Función para obtener las tareas del archivo JSON
const getTasks = async () => {
	const data = await fs.readFile(tasksFilePath, 'utf-8'); // Leemos el archivo de manera asincrónica
	return JSON.parse(data); // Parseamos el JSON y lo retornamos
};
// Función para obtener los usuarios del archivo JSON
const getUsers = async () => {
	const data = await fs.readFile(usersFilePath, 'utf-8');
	return JSON.parse(data);
};
// Función para obtener las prioridades del archivo JSON
const getPriorities = async () => {
	const data = await fs.readFile(prioritiesFilePath, 'utf-8');
	return JSON.parse(data);
};
// Función para obtener los usuarios del archivo JSON
const getStatuses = async () => {
	const data = await fs.readFile(statusesFilePath, 'utf-8');
	return JSON.parse(data);
};


router.get('/', async (req, res) => {
	try {
		const tasks = await getTasks();
		const users = await getUsers();
		const priorities = await getPriorities(); // Obtener prioridades
		const statuses = await getStatuses();
		
		// Mapea los nombres de responsables y prioridades
		const tasksWithDetails = tasks.map(task => {
			const user = users.find(user => user.id === task.idResponsable);
			const priority = priorities.find(priority => priority.id === task.idPrioridad); // Buscar la prioridad correspondiente
			const status = statuses.find(status => status.id === task.idEstado); // Buscar el estado correspondiente

			return {
				...task,
				responsableNombre: user ? user.nombre : 'Desconocido', // Agrega el nombre del responsable
				prioridadNombre: priority ? priority.nombre : 'Sin prioridad', // Agrega el nombre de la prioridad
				Estado: status ? status.nombre : 'Sin estado' // Agrega el estado correspondiente
			};
		});
		
		const message = req.query.message; 
		res.render('tasks', { tasks: tasksWithDetails, message }); // Envía las tareas con los detalles
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
		const users = await getUsers(); // Leemos los usuarios
		const priorities = await getPriorities(); // Leemos las prioridades
        const statuses = await getStatuses(); // Leemos los estados
		const task = tasks.find((task) => task.id === parseInt(req.params.id)); // Buscamos la tarea

		if (task) {
			res.render('edit-task', {task, users, priorities, statuses }); // Renderizamos la vista de edición
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
        const users = await getUsers(); 
        const priorities = await getPriorities();
        const statuses = await getStatuses();
        const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));

        if (taskIndex !== -1) {
            const updatedTask = {
                ...tasks[taskIndex],
                ...req.body,
                idResponsable: parseInt(req.body.idResponsable, 10), // Convertir a número
                idPrioridad: parseInt(req.body.idPrioridad, 10), // Convertir a número
                idEstado: parseInt(req.body.idEstado, 10) // Convertir a número
            };

            tasks[taskIndex] = updatedTask; 
            await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2)); 

            const tasksWithDetails = tasks.map(task => {
                const user = users.find(user => user.id === task.idResponsable);
                const priority = priorities.find(p => p.id === task.idPrioridad);
                const status = statuses.find(s => s.id === task.idEstado);

                return {
                    ...task,
                    responsableNombre: user ? user.nombre : 'Desconocido',
                    prioridadNombre: priority ? priority.nombre : 'Sin Prioridad',
                    estadoNombre: status ? status.nombre : 'Sin Estado'
                };
            });

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
