const fs = require('fs').promises;
const path = require('path');
const User = require('../models/users');
const bcrypt = require('bcryptjs');

const mainController = {
	renderLoginPage: (req, res) => {
	  res.render('index', { title: 'Inicio de Sesión' });
	},
  
	processLogin: async (req, res) => {
	  const { username, password } = req.body;
	  try {
		// Buscar el usuario por nombre
		const user = await User.findOne({ nombre: username });
  
		if (user) {
		  // Comparar la contraseña proporcionada con la contraseña encriptada en la base de datos
		  const isMatch = await bcrypt.compare(password, user.contraseña);
  
		  if (isMatch) {
			// Si las contraseñas coinciden, guardar la sesión dependiendo del rol
			req.session.user = {
			  id: user.id,
			  nombre: user.nombre,
			  rol: user.rol,
			};
			if (user.rol === 'admin') {
			  res.redirect('/admin');
			} else {
			  res.redirect('/home');
			}
		  } else {
			// Si las contraseñas no coinciden
			res.render('index', {
			  title: 'Inicio de Sesión',
			  error: 'Credenciales incorrectas',
			});
		  }
		} else {
		  // Si no se encuentra el usuario
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