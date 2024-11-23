document.getElementById('loginForm').addEventListener('submit', async (e) => {
	e.preventDefault();

	const nombre = e.target.nombre.value;
	const contraseña = e.target.contraseña.value;

	try {
		const response = await fetch('/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ nombre, contraseña }),
		});

		const data = await response.json();

		if (data.success) {
			if (data.user.rol === 'admin') {
				window.location.href = '/admin';
			} else {
				window.location.href = '/home';
			}
		} else {
			alert(data.message);
		}
	} catch (error) {
		console.error('Error al iniciar sesión:', error);
		alert('Error al intentar iniciar sesión. Por favor, intenta de nuevo.');
	}
});
