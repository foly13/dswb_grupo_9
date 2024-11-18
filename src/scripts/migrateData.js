require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');  // Importar mongoose para la conexión a MongoDB

// Obtener la URI de conexión desde el archivo .env
const uri = process.env.MONGODB_URI;

// Modelos de Mongoose
const Priority = require('../models/priorities');
const Status = require('../models/statuses');
const Task = require('../models/tasks');
const User = require('../models/users');

// Función para migrar los datos
async function migrateData() {
    try {
        // Conectar a la base de datos usando Mongoose
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: { version: '1', strict: true, deprecationErrors: true } });

         // Ping a la base de datos para asegurarse de que está conectada
         await mongoose.connection.db.admin().command({ ping: 1 });
         console.log("Pinged your deployment. You successfully connected to MongoDB!");

        // Cargar datos desde los archivos JSON
        const priorities = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'priorities.json')));
        const statuses = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'statuses.json')));
        const tasks = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'tasks.json')));
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'users.json')));

        // Guardar los datos en la base de datos
        await Priority.insertMany(priorities);
        await Status.insertMany(statuses);
        await Task.insertMany(tasks);
        await User.insertMany(users);

        console.log('Datos migrados exitosamente');
    } catch (error) {
        console.error('Error al migrar los datos:', error);
    } finally {
        // Cerrar la conexión después de la migración
        await mongoose.disconnect();
    }
}

// Ejecutar la migración
migrateData();
