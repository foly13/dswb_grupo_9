const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Task_Management_DB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

// Manejo de errores de conexión
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conexión a MongoDB establecida exitosamente');
});

module.exports = db; // Exportar la conexión para usarla en otros archivos
