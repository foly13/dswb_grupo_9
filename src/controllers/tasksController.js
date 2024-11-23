const mongoose = require('mongoose');

const Task = require('../models/tasks');
const User = require('../models/users');
const Priority = require('../models/priorities');
const Status = require('../models/statuses');

const taskController = {
	getAllTasks: async (req, res) => {
		try {
			const tasks = await Task.find();
			const users = await User.find();
			const priorities = await Priority.find();
			const statuses = await Status.find();

			const { estado, prioridad } = req.query;

			let filteredTasks = tasks.map((task) => {
				const user = users.find(
					(user) => user._id.equals(task.idResponsable) // Usamos .equals() para comparar ObjectIds
				);

				const priority = priorities.find(
					(priority) => priority.id === task.idPrioridad
				);
				const status = statuses.find(
					(status) => status.id === task.idEstado
				);

				return {
					...task.toObject(),
					responsableNombre: user ? user.nombre : 'Desconocido',
					prioridadNombre: priority ? priority.nombre : 'Sin prioridad',
					Estado: status ? status.nombre : 'Sin estado',
				};
			});

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

			const userRole = req.session.user ? req.session.user.rol : null;
			const backUrl = userRole === 'admin' ? '/admin' : '/home';
			const message = req.query.message;

			res.render('tasks', { tasks: filteredTasks, message, backUrl });
		} catch (error) {
			res.status(500).send('Error al obtener las tareas');
		}
	},
	showTaskDetails: async (req, res) => {
		try {
			const task = await Task.findById(req.params.id);
			if (!task) return res.status(404).send('Tarea no encontrada');

			const users = await User.find();
			const priorities = await Priority.find();
			const statuses = await Status.find();

			const responsable = users.find(
				(user) => user._id.equals(task.idResponsable) // Usamos .equals() para comparar los ObjectIds
			);
			const prioridad = priorities.find(
				(priority) => priority.id === task.idPrioridad
			);
			const estado = statuses.find((status) => status.id === task.idEstado);

			const taskWithDetails = {
				...task.toObject(),
				responsableNombre: responsable ? responsable.nombre : 'Desconocido',
				prioridadNombre: prioridad ? prioridad.nombre : 'Sin prioridad',
				Estado: estado ? estado.nombre : 'Sin estado',
			};

			res.render('task-detail', { task: taskWithDetails });
		} catch (error) {
			res.status(500).send(
				'Error al obtener la tarea para mostrar los detalles'
			);
		}
	},
	getEditTaskForm: async (req, res) => {
		try {
			const task = await Task.findById(req.params.id);
			if (!task) return res.status(404).send('Tarea no encontrada');

			const users = await User.find();
			const priorities = await Priority.find();
			const statuses = await Status.find();

			res.render('edit-task', {
				task,
				users,
				priorities,
				statuses,
			});
		} catch (error) {
			res.status(500).send('Error al obtener la tarea para editar');
		}
	},

	updateTask: async (req, res) => {
		try {
			const task = await Task.findById(req.params.id);
			if (!task) return res.status(404).send('Tarea no encontrada');

			const updatedTask = {
				...task.toObject(),
				...req.body,
				idResponsable: new mongoose.Types.ObjectId(req.body.idResponsable),
			};

			await Task.findByIdAndUpdate(req.params.id, updatedTask);
			res.redirect('/tasks?message=Tarea actualizada con éxito');
		} catch (error) {
			console.log(error);
			res.status(500).send('Error al actualizar la tarea');
		}
	},
	deleteTask: async (req, res) => {
		try {
			const task = await Task.findByIdAndDelete(req.params.id);
			if (!task) return res.status(404).send('Tarea no encontrada');

			res.redirect('/tasks?message=Tarea eliminada');
		} catch (error) {
			res.status(500).send('Error al eliminar la tarea');
		}
	},
	getNewTaskForm: async (req, res) => {
		try {
			const users = await User.find();
			const priorities = await Priority.find();
			const statuses = await Status.find();

			res.render('new-task', { users, priorities, statuses });
		} catch (error) {
			res.status(500).send(
				'Error al cargar el formulario para crear una nueva tarea'
			);
		}
	},
	createTask: async (req, res) => {
		try {
			if (
				!req.body.Area ||
				!req.body.Tarea ||
				!req.body.idResponsable ||
				!req.body.idPrioridad ||
				!req.body.idEstado
			) {
				return res.status(400).send('Faltan datos requeridos');
			}

			if (!mongoose.Types.ObjectId.isValid(req.body.idResponsable)) {
				return res.status(400).send('El id del responsable no es válido');
			}

			const users = await User.find();
			const usuario = users.find(
				(user) => user.id === parseInt(req.body.idResponsable)
			);

			const newTask = new Task({
				Tarea: req.body.Tarea,
				idResponsable: new mongoose.Types.ObjectId(req.body.idResponsable),
				idPrioridad: parseInt(req.body.idPrioridad, 10),
				idEstado: parseInt(req.body.idEstado, 10),
				Area: usuario ? usuario.Area : 'Desconocido',
			});
			await newTask.save();
			res.redirect('/tasks?message=Tarea creada con éxito');
		} catch (error) {
			console.error('Error al crear la tarea:', error);
			res.status(500).send('Error al crear la tarea');
		}
	},
};

module.exports = taskController;
