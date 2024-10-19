const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = 3000;
const methodOverride = require('method-override');

// Configuración de express-session
app.use(
	session({
		secret: 'tu_secreto_seguro',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
	})
);

//para usar el method
app.use(methodOverride('_method'));

// Configuración de Pug como motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware para parsear JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//para usar formulario
app.use(express.urlencoded({ extended: true }));

// para Importar rutas
const mainRoutes = require('./routes/main.js');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

// Usa las rutas
app.use('/', mainRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// Página de inicio
app.get('/', (req, res) => {
	res.render('index', { title: 'Gestión de Tareas' });
});
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
