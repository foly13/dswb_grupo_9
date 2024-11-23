const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next) => {
	const token = req.cookies.token;

	if (!token) {
		return res
			.status(403)
			.json({ message: 'No tienes permiso para acceder a esta página.' });
	}

	// Verificar el token usando JWT
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(403).json({ message: 'Token inválido o expirado.' });
		}

		// Verificar el rol de admin
		if (decoded.rol !== 'admin') {
			return res
				.status(403)
				.json({ message: 'No tienes permisos de administrador.' });
		}
		req.user = decoded;
		next();
	});
};

module.exports = adminMiddleware;
