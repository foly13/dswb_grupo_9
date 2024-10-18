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
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await getTasks();
        const users = await getUsers();
        const priorities = await getPriorities();
        const statuses = await getStatuses();

        const tasksWithDetails = tasks.map(task => {
            const user = users.find(user => user.id === task.idResponsable);
            const priority = priorities.find(priority => priority.id === task.idPrioridad);
            const status = statuses.find(status => status.id === task.idEstado);

            return {
                ...task,
                responsableNombre: user ? user.nombre : 'Desconocido',
                prioridadNombre: priority ? priority.nombre : 'Sin prioridad',
                Estado: status ? status.nombre : 'Sin estado'
            };
        });

        const message = req.query.message;
        res.render('tasks', { tasks: tasksWithDetails, message });
    } catch (error) {
        res.status(500).send('Error al obtener las tareas');
    }
};



//mostrar detalles de tarea
exports.showTaskDetails = async (req, res) => {
    try {
        const tasks = await getTasks();
        const users = await getUsers();
        const priorities = await getPriorities();
        const statuses = await getStatuses();
        const task = tasks.find((task) => task.id === parseInt(req.params.id));

        if (task) {
            // Obtener los detalles del responsable, prioridad y estado
            const responsable = users.find(user => user.id === task.idResponsable);
            const prioridad = priorities.find(priority => priority.id === task.idPrioridad);
            const estado = statuses.find(status => status.id === task.idEstado);

            // Agregar los nombres al objeto de la tarea
            const taskWithDetails = {
                ...task,
                responsableNombre: responsable ? responsable.nombre : 'Desconocido',
                prioridadNombre: prioridad ? prioridad.nombre : 'Sin prioridad',
                Estado: estado ? estado.nombre : 'Sin estado'
            };

            // Renderizar la vista con los detalles de la tarea
            res.render('task-detail', { task: taskWithDetails });
        } else {
            res.status(404).send('Tarea no encontrada');
        }
    } catch (error) {
        res.status(500).send('Error al obtener la tarea para mostrar los detalles');
    }
};




// Mostrar formulario de edición
exports.getEditTaskForm = async (req, res) => {
    try {
        const tasks = await getTasks();
        const users = await getUsers();
        const priorities = await getPriorities();
        const statuses = await getStatuses();
        const task = tasks.find((task) => task.id === parseInt(req.params.id));

        if (task) {
            const areaUsers = users.filter(user => user.area === task.Area);
            res.render('edit-task', { task, users: areaUsers, priorities, statuses });
        } else {
            res.status(404).send('Tarea no encontrada');
        }
    } catch (error) {
        res.status(500).send('Error al obtener la tarea para editar');
    }
};

// Actualizar tarea
exports.updateTask = async (req, res) => {
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
                idResponsable: parseInt(req.body.idResponsable, 10),
                idPrioridad: parseInt(req.body.idPrioridad, 10),
                idEstado: parseInt(req.body.idEstado, 10)
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
};

// Eliminar tarea
exports.deleteTask = async (req, res) => {
    try {
        const tasks = await getTasks();
        const newTasks = tasks.filter((task) => task.id !== parseInt(req.params.id));

        if (newTasks.length !== tasks.length) {
            await fs.writeFile(tasksFilePath, JSON.stringify(newTasks, null, 2));
            res.redirect('/tasks?message=Tarea eliminada');
        } else {
            res.status(404).send('Tarea no encontrada');
        }
    } catch (error) {
        res.status(500).send('Error al eliminar la tarea');
    }
};
