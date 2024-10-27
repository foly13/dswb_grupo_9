const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    area: { type: String, required: true },
    contraseña: { type: String, required: true },
    rol: { type: String }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
