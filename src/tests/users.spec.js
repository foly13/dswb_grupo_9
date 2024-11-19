const path = require('path');
const request = require('supertest');
const server = require('../server'); 
const testUsersFilePath = path.join(__dirname, 'dataTemporal/testUsers.json');

// Mock de controlador y middleware
jest.mock('../controllers/usersController', () => ({
  getAllUsers: jest.fn((req, res) => res.status(200).json([{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }])),
  renderNewUserForm: jest.fn((req, res) => res.status(200).send('Render form')),
  addNewUser: jest.fn((req, res) => res.status(201).json({ id: 3, name: 'New User' })),
  renderEditUserForm: jest.fn((req, res) => res.status(200).send('Edit user form')),
  updateUser: jest.fn((req, res) => res.status(200).json({ id: req.params.id, name: 'Updated User' })),
  deleteUser: jest.fn((req, res) => res.status(200).json({ message: 'User deleted' })) // Mock de deleteUser
}));

jest.mock('../middlewares/adminMiddleware', () => jest.fn((req, res, next) => next()));

describe('GET /users', () => {
  it('should return a list of users', async () => {
    const response = await request(server).get('/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ]);
  });
});

describe('POST /users', () => {
  it('should add a new user', async () => {
    const newUser = { name: 'New User' };
    const response = await request(server).post('/users').send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ id: 3, name: 'New User' });
  });
});

describe('GET /users/:id/edit', () => {
  it('should render the edit user form', async () => {
    const response = await request(server).get('/users/1/edit');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Edit user form');
  });
});

describe('DELETE /users/:id', () => {
  it('should delete a user', async () => {
    const response = await request(server).delete('/users/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'User deleted' });
  });
});
