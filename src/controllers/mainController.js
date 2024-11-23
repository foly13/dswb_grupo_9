const jwt = require('jsonwebtoken');
const User = require('../models/users');
const bcrypt = require('bcryptjs');

const mainController = {
	renderLoginPage: (req, res) => {
		res.render('index', { title: 'Inicio de Sesión' });
	},
	processLogin: async (req, res) => {
		const { nombre, contraseña } = req.body;

		try {
			const user = await User.findOne({ nombre });

			if (user) {
				const isMatch = await bcrypt.compare(contraseña, user.contraseña);

				if (isMatch) {
					// Verificar si el rol del usuario es 'admin'
					if (user.rol === 'admin') {
						// Si el rol es 'admin', generar el token y guardarlo en la cookie
						const token = jwt.sign(
							{
								id: user._id,
								nombre: user.nombre,
								rol: user.rol,
							},
							process.env.JWT_SECRET,
							{ expiresIn: '1h' }
						);

						res.cookie('token', token, {
							httpOnly: true, // Protege contra XSS
							secure: process.env.NODE_ENV === 'production',
							maxAge: 3600000,
						});

						return res.status(200).json({
							success: true,
							message: 'Inicio de sesión exitoso',
							user: {
								id: user._id,
								nombre: user.nombre,
								rol: user.rol,
							},
						});
					} else {
						// Si el usuario no es admin, redirigir a la página /home
						return res.status(200).json({
							success: true,
							message: 'Inicio de sesión exitoso, redirigiendo a /home',
							user: {
								id: user._id,
								nombre: user.nombre,
								rol: user.rol,
							},
						});
					}
				} else {
					return res.status(401).json({
						success: false,
						message: 'Credenciales incorrectas',
					});
				}
			} else {
				return res.status(404).json({
					success: false,
					message: 'Usuario no encontrado',
				});
			}
		} catch (error) {
			console.error(
				'Error al buscar el usuario en la base de datos:',
				error
			);
			return res.status(500).json({
				success: false,
				message: 'Error en el sistema, intenta más tarde',
			});
		}
	},
	renderHomePage: (req, res) => {
		res.render('home', { title: 'Gestión de tareas' });
	},
};

module.exports = mainController;
