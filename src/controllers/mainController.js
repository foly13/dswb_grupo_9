const jwt = require('jsonwebtoken');
const User = require('../models/users');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'tu_secreto_clave';

const mainController = {
	renderLoginPage: (req, res) => {
		res.render('index', { title: 'Inicio de Sesión' });
	},
	processLogin: async (req, res) => {
		const { nombre, contraseña } = req.body;

		try {
			// Buscar el usuario por nombre
			const user = await User.findOne({ nombre: nombre });

			if (user) {
				// Comparar la contraseña proporcionada con la contraseña encriptada en la base de datos
				const isMatch = await bcrypt.compare(contraseña, user.contraseña);

				if (isMatch) {
					// Crear un token JWT con los datos del usuario
					const token = jwt.sign(
						{
							id: user._id,
							nombre: user.nombre,
							rol: user.rol,
						},
						JWT_SECRET,
						{ expiresIn: '1h' }
					);
					return res.status(200).json({
						success: true,
						message: 'Inicio de sesión exitoso',
						token,
						user: {
							id: user._id,
							nombre: user.nombre,
							rol: user.rol,
						},
					});
				} else {
					// Si las contraseñas no coinciden
					return res.status(401).json({
						success: false,
						message: 'Credenciales incorrectas',
					});
				}
			} else {
				// Si no se encuentra el usuario
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
