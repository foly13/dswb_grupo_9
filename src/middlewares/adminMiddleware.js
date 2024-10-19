const adminMiddleware = (req, res, next) => {
	if (req.session && req.session.user && req.session.user.rol === 'admin') {
		return next();
	}
	return res.status(403).render('error', {
		title: 'Acceso Denegado',
		message: 'No tienes permisos para acceder a esta sección.',
	});
};

module.exports = adminMiddleware;
