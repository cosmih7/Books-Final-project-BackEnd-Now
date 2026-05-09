const User = require('../src/models/user.model');
const Book = require('../src/models/book.model');

const adminData = { name: 'Admin', email: 'admin@example.com', password: 'adminpass' };
const bookData = { title: 'Effective Testing', author: 'Joe Code', isbn: '9781234567890', genre: 'Technology', publishedYear: 2025 };

let adminToken;

beforeEach(async () => {
  await request.post('/api/auth/signup').send(adminData);
  const user = await User.findOne({ email: adminData.email });
  user.role = 'admin';
  await user.save();

  const login = await request.post('/api/auth/login').send({ email: adminData.email, password: adminData.password });
  adminToken = login.body.token;
});

describe('Book routes', () => {
  test('admin can create a new book', async () => {
    const response = await request.post('/api/books').set('Authorization', `Bearer ${adminToken}`).send(bookData);

    expect(response.status).toBe(201);
    expect(response.body.book.title).toBe(bookData.title);
  });

  test('books list supports text search', async () => {
    await request.post('/api/books').set('Authorization', `Bearer ${adminToken}`).send(bookData);
    const response = await request.get('/api/books').query({ search: 'Testing' });

    expect(response.status).toBe(200);
    expect(response.body.books).toHaveLength(1);
    expect(response.body.books[0].isbn).toBe(bookData.isbn);
  });

  test('book details include aggregated review stats', async () => {
    const create = await request.post('/api/books').set('Authorization', `Bearer ${adminToken}`).send(bookData);
    const bookId = create.body.book._id;
    await request.post('/api/auth/signup').send({ name: 'Reviewer', email: 'rev@example.com', password: 'revpass' });
    const login = await request.post('/api/auth/login').send({ email: 'rev@example.com', password: 'revpass' });
    const token = login.body.token;

    await request.post('/api/reviews').set('Authorization', `Bearer ${token}`).send({ bookId, rating: 5, comment: 'Excellent' });

    const response = await request.get(`/api/books/${bookId}`);

    expect(response.status).toBe(200);
    expect(response.body.stats.reviewCount).toBe(1);
    expect(response.body.stats.averageRating).toBe(5);
  });

  test('regular user cannot create a book', async () => {
    await request.post('/api/auth/signup').send({ name: 'Book User', email: 'user2@example.com', password: 'userpass' });
    const login = await request.post('/api/auth/login').send({ email: 'user2@example.com', password: 'userpass' });
    const token = login.body.token;

    const response = await request.post('/api/books').set('Authorization', `Bearer ${token}`).send(bookData);
    expect(response.status).toBe(403);
  });
});
