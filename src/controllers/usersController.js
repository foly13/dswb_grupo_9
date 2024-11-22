const User = require('../models/users');

const getUsers = async () => {
	try {
		return await User.find(); // Obtiene todos los usuarios de la base de datos
	} catch (error) {
		throw new Error('Error al obtener los usuarios de la base de datos');
	}
};

const userController = {
	getAllUsers: async (req, res) => {
		try {
			const users = await getUsers();
			const successMessage = req.query.successMessage;
			res.render('users', { users, successMessage });
		} catch (error) {
			res.status(500).send('Error al obtener los usuarios');
		}
	},

	renderNewUserForm: async (req, res) => {
		try {
			const users = await getUsers();
			const newUserId =
				users.length > 0 ? users[users.length - 1].id + 1 : 1;
			res.render('new-user', { user: { id: newUserId }, query: req.query });
		} catch (error) {
			res.status(500).send(
				'Error al cargar la vista de creación de usuario'
			);
		}
	},
	addNewUser: async (req, res) => {
		try {
			const { nombre, area, contraseña, rol } = req.body;

			if (!nombre || !area || !contraseña) {
				return res.status(400).send('Faltan datos requeridos.');
			}

			const newUser = new User({
				nombre,
				area,
				contraseña,
				rol,
			});

			await newUser.save();

			res.redirect('/users/new?success=true');
		} catch (error) {
			console.error('Error al agregar usuario:', error);
			res.status(500).send('Error al agregar el usuario');
		}
	},
	renderEditUserForm: async (req, res) => {
		try {
			const user = await User.findById(req.params.id);

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

			user.nombre = req.body.nombre || user.nombre;
			user.area = req.body.area || user.area;
			user.contraseña = req.body.contraseña || user.contraseña;

			await user.save();

			res.redirect(`/users/${req.params.id}/edit?success=true`);
		} catch (error) {
			console.error('Error al actualizar usuario:', error);
			res.status(500).send('Error al actualizar el usuario');
		}
	},

	deleteUser: async (req, res) => {
		try {
			const user = await User.findByIdAndDelete(req.params.id);

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
