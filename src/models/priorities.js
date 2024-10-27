const mongoose = require('mongoose');

const prioritySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true }
});

const Priority = mongoose.model('Priority', prioritySchema);
module.exports = Priority;
