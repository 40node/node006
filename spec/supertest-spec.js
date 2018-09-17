/* eslint-env jasmine */

// routing テスト
const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('respond with http', (done) => {
    request(app)
      .get('/')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});

describe('GET /books/', () => {
  it('respond with http', (done) => {
    request(app)
      .get('/books/')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});

describe('GET /books/:id', () => {
  it('respond with http', (done) => {
    request(app)
      .get('/books/1')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});

describe('POST /books/create', () => {
  it('respond with http', (done) => {
    request(app)
      .post('/books/create')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});

describe('POST /books/update/:id', () => {
  it('respond with http', (done) => {
    request(app)
      .post('/books/update/1')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});

describe('GET /books/destroy/:id', () => {
  it('respond with http', (done) => {
    request(app)
      .get('/books/destroy/1')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});

describe('POST /books/update', () => {
  it('no http page', (done) => {
    request(app)
      .post('/books/destroy/1')
      .set('Accept', 'text/html')
      .expect(404, done);
  });
});
