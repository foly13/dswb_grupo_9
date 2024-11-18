const fs = require('fs').promises;
const path = require('path');
const User = require('../models/users');

const mainController = {
	renderLoginPage: (req, res) => {
		res.render('index', { title: 'Inicio de Sesión' });
	},

	processLogin: async (req, res) => {
		const { username, password } = req.body;
		try {
			// Buscar usuario con las credenciales ingresadas en MongoDB
			const user = await User.findOne({ nombre: username, contraseña: password });

			if (user) {
				if (user.rol === 'admin') {
					req.session.user = {
						id: user._id,
						nombre: user.nombre,
						rol: user.rol,
					};
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
			console.error('Error al buscar el usuario en la base de datos:', error);
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
