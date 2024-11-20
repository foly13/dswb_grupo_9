const path = require('path');
const request = require('supertest');
const server = require('../server'); 
const testUsersFilePath = path.join(__dirname, 'dataTemporal/testUsers.json');

// Mock de controlador y middleware
jest.mock('../controllers/usersController', () => ({
  getAllUsers: jest.fn((req, res) => {
    const testUsers = require('./dataTemporal/testUsers.json');
    res.status(200).json(testUsers);
  }),
  renderNewUserForm: jest.fn((req, res) => res.status(200).send('Render form')),
  addNewUser: jest.fn((req, res) => res.status(201).json({ id: 3, name: 'New User' })),
  renderEditUserForm: jest.fn((req, res) => res.status(200).send('Edit user form')),
  updateUser: jest.fn((req, res) => res.status(200).json({ id: req.params.id, name: 'Updated User' })),
  deleteUser: jest.fn((req, res) => res.status(200).json({ message: 'User deleted' })) 
}));

jest.mock('../middlewares/adminMiddleware', () => jest.fn((req, res, next) => next()));

//tests

describe('GET /users', () => {
  test('should return a list of users from the JSON file', async () => {
    const response = await request(server).get('/users');
    expect(response.statusCode).toBe(200);
    const testUsers = require('./dataTemporal/testUsers.json');
    expect(response.body).toEqual(testUsers);
  });
});

describe('POST /users', () => {
  test('should add a new user', async () => {
    const newUser = { name: 'New User' };
    const response = await request(server).post('/users').send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({ id: 3, name: 'New User' });
  });
});

describe('GET /users/:id/edit', () => {
  test('should render the edit user form', async () => {
    const response = await request(server).get('/users/1/edit');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Edit user form');
  });
});

describe('DELETE /users/:id', () => {
  test('should delete a user', async () => {
    const response = await request(server).delete('/users/1');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'User deleted' });
  });
});
