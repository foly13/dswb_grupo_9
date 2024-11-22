const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
	Area: { type: String, required: true },
	Tarea: { type: String, required: true },
	idResponsable: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	idEstado: { type: Number, required: true },
	idPrioridad: { type: Number, required: true },
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
