const mongoose = require('mongoose');
const fs = require('fs');
const User = require('./models/users');
const Task = require('./models/tasks');
const Status = require('./models/statuses');
const Priority = require('./models/priorities'); 

// Conectar a MongoDB
mongoose.connect('mongodb+srv://grupo9:BackEnd@gestortareasdb.ie1iz.mongodb.net/?retryWrites=true&w=majority&appName=GestorTareasDB')
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error de conexión:', err));

// Cargar datos desde JSON
const importData = async () => {
    try {
        const usersData = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));
        const tasksData = JSON.parse(fs.readFileSync('./data/tasks.json', 'utf-8'));
        const statusesData = JSON.parse(fs.readFileSync('./data/statuses.json', 'utf-8'));
        const prioritiesData = JSON.parse(fs.readFileSync('./data/priorities.json', 'utf-8'));
        await User.insertMany(usersData);
        await Task.insertMany(tasksData);
        await Status.insertMany(statusesData);
        await Priority.insertMany(prioritiesData);
        console.log('Datos importados correctamente');
        process.exit();
    } catch (error) {
        console.error('Error al importar datos:', error);
        process.exit(1);
    }
};

importData();
