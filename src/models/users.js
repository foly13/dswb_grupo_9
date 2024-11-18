const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    nombre: { type: String, required: true },
    area: { type: String, required: true },
    contraseña: { type: String, required: true },
    rol: { type: String }
});

// Encriptar la contraseña antes de guardar el usuario
UserSchema.pre('save', async function(next) {
    if (this.isModified('contraseña')) {
      const salt = await bcrypt.genSalt(10);
      this.contraseña = await bcrypt.hash(this.contraseña, salt);
    }
    next();
  });
  
const User = mongoose.model('User', userSchema);
module.exports = User;