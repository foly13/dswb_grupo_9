const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true }
});

const Status = mongoose.model('Status', statusSchema);
module.exports = Status;
