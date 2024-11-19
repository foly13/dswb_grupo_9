// server.js
const app = require('./app'); // Importa la configuración de la aplicación
const http = require('http'); // Importa http para crear el servidor

const server = http.createServer(app); // Crea el servidor HTTP

module.exports = server; // Exporta el servidor para poder utilizarlo en las pruebas
