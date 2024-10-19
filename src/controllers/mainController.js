const fs = require('fs').promises;
const path = require('path');

const mainController = {
	renderLoginPage: (req, res) => {
		res.render('index', { title: 'Inicio de Sesión' });
	},

	processLogin: async (req, res) => {
		const { username, password } = req.body;
		try {
			// Leer usuarios desde el archivo JSON
			const usersFilePath = path.join(__dirname, '../data/users.json');
			const data = await fs.readFile(usersFilePath, 'utf-8');
			const users = JSON.parse(data);

			// Buscar usuario con las credenciales ingresadas
			const user = users.find(
				(u) => u.nombre === username && u.contraseña === password
			);

			if (user) {
				// Almacena la información del usuario en la sesión
				req.session.user = {
					id: user.id,
					nombre: user.nombre,
					rol: user.rol,
				};

				// Redirige según el rol del usuario
				if (user.rol === 'admin') {
					res.redirect('/admin');
				} else {
					res.redirect('/home');
				}
			} else {
				// Credenciales incorrectas
				res.render('index', {
					title: 'Inicio de Sesión',
					error: 'Credenciales incorrectas',
				});
			}
		} catch (error) {
			console.error('Error al leer el archivo de usuarios:', error);
			res.render('index', {
				title: 'Inicio de Sesión',
				error: 'Error en el sistema, intenta más tarde',
			});
		}
	},
	renderHomePage: (req, res) => {
		res.render('home', { title: 'Gestión de tareas' });
	},
};

module.exports = mainController;
