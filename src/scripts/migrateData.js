const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const db = require('../db'); // Importar la conexión a la base de datos

// Modelos
const Priority = require('../models/priorities');
const Status = require('../models/statuses');
const Task = require('../models/tasks');
const User = require('../models/users');

// Esperar a que se establezca la conexión antes de migrar
db.once('open', async () => {
    try {
        // Cargar datos de archivos JSON
        const priorities = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'priorities.json')));
        const statuses = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'statuses.json')));
        const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tasks.json')));
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json')));

        // Guardar datos en la base de datos
        await Priority.insertMany(priorities);
        await Status.insertMany(statuses);
        await Task.insertMany(tasks);
        await User.insertMany(users);

        console.log('Datos migrados exitosamente');
    } catch (error) {
        console.error('Error al migrar los datos:', error);
    } finally {
        // Cerrar la conexión
        mongoose.connection.close();
    }
});
