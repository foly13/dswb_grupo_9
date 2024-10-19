const fs = require('fs').promises;
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

// Función para leer usuarios desde el archivo JSON
const getUsers = async () => {
	const data = await fs.readFile(usersFilePath, 'utf-8');
	return JSON.parse(data);
};

const userController = {
	getAllUsers: async (req, res) => {
		try {
			const users = await getUsers();
			const successMessage = req.query.successMessage; // Obtener el mensaje de la query
			res.render('users', { users, successMessage }); // Pasar el mensaje a la vista
		} catch (error) {
			res.status(500).send('Error al obtener los usuarios');
		}
	},

	renderNewUserForm: async (req, res) => {
		try {
			const users = await getUsers();
			const newUserId =
				users.length > 0 ? users[users.length - 1].id + 1 : 1; // Generar un nuevo ID basado en el último usuario
			res.render('new-user', { user: { id: newUserId }, query: req.query });
		} catch (error) {
			res.status(500).send(
				'Error al cargar la vista de creación de usuario'
			);
		}
	},

	addNewUser: async (req, res) => {
		try {
			const users = await getUsers();
			const newUser = req.body;

			// Validación
			if (!newUser.nombre || !newUser.area || !newUser.contraseña) {
				return res.redirect('/users/new?error=true');
			}

			// Asignar el ID automáticamente
			newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
			users.push(newUser);

			// Guardar nuevo usuario
			await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

			// Redirigir
			res.redirect('/users/new?success=true');
		} catch (error) {
			console.error('Error al agregar usuario:', error);
			res.status(500).send('Error al agregar el usuario');
		}
	},

	renderEditUserForm: async (req, res) => {
		try {
			const users = await getUsers();
			const user = users.find((user) => user.id === parseInt(req.params.id));

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
			const users = await getUsers();
			const userIndex = users.findIndex(
				(user) => user.id === parseInt(req.params.id)
			);
			if (userIndex === -1) {
				return res.status(404).send('Usuario no encontrado');
			}

			// Actualizar los campos del usuario
			users[userIndex] = { ...users[userIndex], ...req.body };

			// Guardar cambios
			await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

			// Redirigir a la vista de edición con un mensaje de éxito
			res.redirect(`/users/${req.params.id}/edit?success=true`);
		} catch (error) {
			console.error('Error al actualizar usuario:', error);
			res.status(500).send('Error al actualizar el usuario');
		}
	},

	deleteUser: async (req, res) => {
		try {
			const users = await getUsers();
			const newUsers = users.filter(
				(user) => user.id !== parseInt(req.params.id)
			);

			if (newUsers.length === users.length) {
				return res.status(404).send('Usuario no encontrado');
			}

			// Guardar el nuevo array de usuarios
			await fs.writeFile(usersFilePath, JSON.stringify(newUsers, null, 2));
			res.redirect('/users?successMessage=Usuario eliminado exitosamente');
		} catch (error) {
			console.error('Error al eliminar usuario:', error);
			res.status(500).send('Error al eliminar el usuario');
		}
	},
};

module.exports = userController;
