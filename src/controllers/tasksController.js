const fs = require('fs').promises;
const path = require('path');

// Rutas de los archivos JSON
const tasksFilePath = path.join(__dirname, '../data/tasks.json');
const usersFilePath = path.join(__dirname, '../data/users.json');
const prioritiesFilePath = path.join(__dirname, '../data/priorities.json');
const statusesFilePath = path.join(__dirname, '../data/statuses.json');

// Funciones auxiliares para leer los datos de los archivos JSON
const getTasks = async () => {
	const data = await fs.readFile(tasksFilePath, 'utf-8');
	return JSON.parse(data);
};

const getUsers = async () => {
	const data = await fs.readFile(usersFilePath, 'utf-8');
	return JSON.parse(data);
};

const getPriorities = async () => {
	const data = await fs.readFile(prioritiesFilePath, 'utf-8');
	return JSON.parse(data);
};

const getStatuses = async () => {
	const data = await fs.readFile(statusesFilePath, 'utf-8');
	return JSON.parse(data);
};

// Controladores para cada operación

// Mostrar todas las tareas
const taskController = {
	// Mostrar todas las tareas con filtrado
	getAllTasks: async (req, res) => {
		try {
			const tasks = await getTasks();
			const users = await getUsers();
			const priorities = await getPriorities();
			const statuses = await getStatuses();

			const { estado, prioridad } = req.query;

			// Filtrado de tareas
			let filteredTasks = tasks.map((task) => {
				const user = users.find((user) => user.id === task.idResponsable);
				const priority = priorities.find(
					(priority) => priority.id === task.idPrioridad
				);
				const status = statuses.find(
					(status) => status.id === task.idEstado
				);

				return {
					...task,
					responsableNombre: user ? user.nombre : 'Desconocido',
					prioridadNombre: priority ? priority.nombre : 'Sin prioridad',
					Estado: status ? status.nombre : 'Sin estado',
				};
			});

			// Aplicación de los filtros si están presentes
			if (estado) {
				filteredTasks = filteredTasks.filter(
					(task) => task.idEstado === parseInt(estado)
				);
			}

			if (prioridad) {
				filteredTasks = filteredTasks.filter(
					(task) => task.idPrioridad === parseInt(prioridad)
				);
			}

			const message = req.query.message;
			res.render('tasks', { tasks: filteredTasks, message });
		} catch (error) {
			res.status(500).send('Error al obtener las tareas');
		}
	},

	// Mostrar detalles de una tarea
	showTaskDetails: async (req, res) => {
		try {
			const tasks = await getTasks();
			const users = await getUsers();
			const priorities = await getPriorities();
			const statuses = await getStatuses();
			const task = tasks.find((task) => task.id === parseInt(req.params.id));

			if (task) {
				const responsable = users.find(
					(user) => user.id === task.idResponsable
				);
				const prioridad = priorities.find(
					(priority) => priority.id === task.idPrioridad
				);
				const estado = statuses.find(
					(status) => status.id === task.idEstado
				);

				const taskWithDetails = {
					...task,
					responsableNombre: responsable
						? responsable.nombre
						: 'Desconocido',
					prioridadNombre: prioridad ? prioridad.nombre : 'Sin prioridad',
					Estado: estado ? estado.nombre : 'Sin estado',
				};

				res.render('task-detail', { task: taskWithDetails });
			} else {
				res.status(404).send('Tarea no encontrada');
			}
		} catch (error) {
			res.status(500).send(
				'Error al obtener la tarea para mostrar los detalles'
			);
		}
	},

	// Mostrar formulario de edición
	getEditTaskForm: async (req, res) => {
		try {
			const tasks = await getTasks();
			const users = await getUsers();
			const priorities = await getPriorities();
			const statuses = await getStatuses();
			const task = tasks.find((task) => task.id === parseInt(req.params.id));

			if (task) {
				const areaUsers = users.filter((user) => user.area === task.Area);
				res.render('edit-task', {
					task,
					users: areaUsers,
					priorities,
					statuses,
				});
			} else {
				res.status(404).send('Tarea no encontrada');
			}
		} catch (error) {
			res.status(500).send('Error al obtener la tarea para editar');
		}
	},

	// Actualizar tarea
	updateTask: async (req, res) => {
		try {
			const tasks = await getTasks();
			const taskIndex = tasks.findIndex(
				(task) => task.id === parseInt(req.params.id)
			);

			if (taskIndex !== -1) {
				const updatedTask = {
					...tasks[taskIndex],
					...req.body,
					idResponsable: parseInt(req.body.idResponsable, 10),
					idPrioridad: parseInt(req.body.idPrioridad, 10),
					idEstado: parseInt(req.body.idEstado, 10),
				};

				tasks[taskIndex] = updatedTask;
				await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));

				res.redirect('/tasks?message=Tarea actualizada con éxito');
			} else {
				res.status(404).send('Tarea no encontrada');
			}
		} catch (error) {
			res.status(500).send('Error al actualizar la tarea');
		}
	},

	// Eliminar tarea
	deleteTask: async (req, res) => {
		try {
			const tasks = await getTasks();
			const newTasks = tasks.filter(
				(task) => task.id !== parseInt(req.params.id)
			);

			if (newTasks.length !== tasks.length) {
				await fs.writeFile(
					tasksFilePath,
					JSON.stringify(newTasks, null, 2)
				);
				res.redirect('/tasks?message=Tarea eliminada');
			} else {
				res.status(404).send('Tarea no encontrada');
			}
		} catch (error) {
			res.status(500).send('Error al eliminar la tarea');
		}
	},
	getNewTaskForm: async (req, res) => {
		try {
			const users = await getUsers();
			const priorities = await getPriorities();
			const statuses = await getStatuses();

			res.render('new-task', { users, priorities, statuses });
		} catch (error) {
			res.status(500).send(
				'Error al cargar el formulario para crear una nueva tarea'
			);
		}
	},

	// Crear una nueva tarea
	createTask: async (req, res) => {
		try {
			// Validación básica de los datos
			if (
				!req.body.tarea ||
				!req.body.idResponsable ||
				!req.body.idPrioridad ||
				!req.body.idEstado
			) {
				return res.status(400).send('Faltan datos requeridos');
			}
			const tasks = await getTasks();
			const users = await getUsers();
			const usuario = users.find(
				(user) => user.id === parseInt(req.body.idResponsable)
			);
			const newTask = {
				id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
				...req.body,
				idResponsable: parseInt(req.body.idResponsable, 10),
				idPrioridad: parseInt(req.body.idPrioridad, 10),
				idEstado: parseInt(req.body.idEstado, 10),
				Tarea: req.body.tarea,
				Area: usuario.Area,
			};
			tasks.push(newTask);
			await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));

			res.redirect('/tasks?message=Tarea creada con éxito');
		} catch (error) {
			res.status(500).send('Error al crear la tarea');
		}
	},
};

// Exportar el controlador
module.exports = taskController;
