const User = require('../src/models/user.model');

const adminData = { name: 'Admin', email: 'adminreview@example.com', password: 'adminpass' };
const bookData = { title: 'Review Driven', author: 'Kate Author', isbn: '9780987654321', genre: 'Business', publishedYear: 2024 };
const reviewData = { rating: 4, comment: 'A solid review' };

let bookId;
let reviewerToken;

beforeEach(async () => {
  await request.post('/api/auth/signup').send(adminData);
  const user = await User.findOne({ email: adminData.email });
  user.role = 'admin';
  await user.save();
  const loginAdmin = await request.post('/api/auth/login').send({ email: adminData.email, password: adminData.password });
  const adminToken = loginAdmin.body.token;

  const createdBook = await request.post('/api/books').set('Authorization', `Bearer ${adminToken}`).send(bookData);
  bookId = createdBook.body.book._id;

  await request.post('/api/auth/signup').send({ name: 'Reviewer', email: 'reviewer@example.com', password: 'reviewpass' });
  const loginReviewer = await request.post('/api/auth/login').send({ email: 'reviewer@example.com', password: 'reviewpass' });
  reviewerToken = loginReviewer.body.token;
});

describe('Review routes', () => {
  test('user can create a review for a book', async () => {
    const response = await request
      .post('/api/reviews')
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({ bookId, ...reviewData });

    expect(response.status).toBe(201);
    expect(response.body.review.rating).toBe(reviewData.rating);
  });

  test('user can update own review', async () => {
    const create = await request
      .post('/api/reviews')
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({ bookId, ...reviewData });
    const reviewId = create.body.review._id;

    const response = await request
      .put(`/api/reviews/${reviewId}`)
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({ rating: 5, comment: 'Updated rating' });

    expect(response.status).toBe(200);
    expect(response.body.review.rating).toBe(5);
  });

  test('user cannot delete another user review', async () => {
    const create = await request
      .post('/api/reviews')
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({ bookId, ...reviewData });
    const reviewId = create.body.review._id;

    await request.post('/api/auth/signup').send({ name: 'Another', email: 'another@example.com', password: 'anotherpass' });
    const loginAnother = await request.post('/api/auth/login').send({ email: 'another@example.com', password: 'anotherpass' });
    const anotherToken = loginAnother.body.token;

    const response = await request.delete(`/api/reviews/${reviewId}`).set('Authorization', `Bearer ${anotherToken}`);

    expect(response.status).toBe(403);
  });

  test('creating a review for a non-existent book returns 404', async () => {
    const response = await request
      .post('/api/reviews')
      .set('Authorization', `Bearer ${reviewerToken}`)
      .send({ bookId: '000000000000000000000000', rating: 3, comment: 'Missing book' });

    expect(response.status).toBe(404);
  });
});
