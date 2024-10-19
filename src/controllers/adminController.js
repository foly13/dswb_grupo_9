const adminController = {
	renderAdminPage: (req, res) => {
		res.render('admin', { title: 'Panel de Administración' });
	},
};

module.exports = adminController;
