const fs = require('fs').promises;
const path = require('path');

const User = mongoose.model('User', userSchema);

/* Función para leer usuarios desde el archivo JSON
const getUsers = async () => {
	const data = await fs.readFile(usersFilePath, 'utf-8');
	return JSON.parse(data);
};*/

// Función para obtener todos los usuarios
const getUsers = async () => {
	try {
	  return await User.find();  // Obtiene todos los usuarios de la base de datos
	} catch (error) {
	  throw new Error('Error al obtener los usuarios de la base de datos');
	}
  };
  
  const userController = {
	getAllUsers: async (req, res) => {
	  try {
		const users = await getUsers();
		const successMessage = req.query.successMessage;  // Obtener el mensaje de la query
		res.render('users', { users, successMessage });
	  } catch (error) {
		res.status(500).send('Error al obtener los usuarios');
	  }
	},
  
	renderNewUserForm: async (req, res) => {
	  try {
		const users = await getUsers();
		const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
		res.render('new-user', { user: { id: newUserId }, query: req.query });
	  } catch (error) {
		res.status(500).send('Error al cargar la vista de creación de usuario');
	  }
	},
  
	addNewUser: async (req, res) => {
	  try {
		const { nombre, area, contraseña } = req.body;
  
		// Validación
		if (!nombre || !area || !contraseña) {
		  return res.redirect('/users/new?error=true');
		}
  
		const newUser = new User({ nombre, area, contraseña });
  
		// Guardar el nuevo usuario en la base de datos
		await newUser.save();
  
		// Redirigir
		res.redirect('/users/new?success=true');
	  } catch (error) {
		console.error('Error al agregar usuario:', error);
		res.status(500).send('Error al agregar el usuario');
	  }
	},
  
	renderEditUserForm: async (req, res) => {
	  try {
		const user = await User.findById(req.params.id);  // Buscar el usuario por su ID
  
		if (!user) {
		  return res.status(404).send('Usuario no encontrado');
		}
  
		res.render('edit-user', { user, success: req.query.success });
	  } catch (error) {
		res.status(500).send('Error al obtener el usuario para editar');
	  }
	},
  
	updateUser: async (req, res) => {
	  try {
		const user = await User.findById(req.params.id);
  
		if (!user) {
		  return res.status(404).send('Usuario no encontrado');
		}
  
		// Actualizar los campos del usuario
		user.nombre = req.body.nombre || user.nombre;
		user.area = req.body.area || user.area;
		user.contraseña = req.body.contraseña || user.contraseña;
  
		// Guardar los cambios
		await user.save();
  
		// Redirigir a la vista de edición con un mensaje de éxito
		res.redirect(`/users/${req.params.id}/edit?success=true`);
	  } catch (error) {
		console.error('Error al actualizar usuario:', error);
		res.status(500).send('Error al actualizar el usuario');
	  }
	},
  
	deleteUser: async (req, res) => {
	  try {
		const user = await User.findByIdAndDelete(req.params.id);  // Eliminar el usuario por su ID
  
		if (!user) {
		  return res.status(404).send('Usuario no encontrado');
		}
  
		res.redirect('/users?successMessage=Usuario eliminado exitosamente');
	  } catch (error) {
		console.error('Error al eliminar usuario:', error);
		res.status(500).send('Error al eliminar el usuario');
	  }
	},
  };
  
  module.exports = userController;