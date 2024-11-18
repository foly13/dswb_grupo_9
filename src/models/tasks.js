const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    Area: { type: String, required: true },
    Tarea: { type: String, required: true },
    idResponsable: { type: Number, required: true },
    idEstado: { type: Number, required: true },
    idPrioridad: { type: Number, required: true }
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;