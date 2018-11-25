/* eslint-env jasmine */

// routing テスト
const request = require('supertest-session');
const app = require('../app');

//let's set up the data we need to pass to the login method
const userCredentials = {
  email: 'tak@oshiire.to',
  password: 'password'
}
const wrongEmailCredentials = {
  email: 'foo',
  password: 'password'
}
const wrongPasswordCredentials = {
  email: 'tak@oshiire.to',
  password: ''
}

//now let's login the user before we run any tests
var authenticatedUser = request(app);

beforeAll((done) => {
  authenticatedUser
    .post('/login')
    .send(userCredentials)
    .expect(302, done);
});

describe('POST /login', () => {
  it('should success login with correct user', (done) => {
    request(app)
      .post('/login')
      .send(userCredentials)
      .expect(302)
      .expect('Location', '/books/', done);
  });
  it('should deny login with wrong email', (done) => {
    request(app)
      .post('/login')
      .send(wrongEmailCredentials)
      .expect(302)
      .expect('Location', '/', done);
  });
  it('should deny login with wrong password', (done) => {
    request(app)
      .post('/login')
      .send(wrongPasswordCredentials)
      .expect(302)
      .expect('Location', '/', done);
  });
})

describe('GET /', () => {
  it('respond with http', (done) => {
    authenticatedUser
      .get('/')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});

describe('GET /books/', () => {
  it('respond with http', (done) => {
    authenticatedUser
      .get('/books/')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});

describe('GET /books/:id', () => {
  it('respond with http', (done) => {
    authenticatedUser
      .get('/books/1')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});

describe('POST /books/create', () => {
  it('respond with http', (done) => {
    authenticatedUser
      .post('/books/create')
      .send({ book_title: 'test', user_id: 1 })
      .set('Accept', 'text/html')
      .expect(302, done);
  });
});

describe('POST /books/update/:id', () => {
  it('respond with http', (done) => {
    authenticatedUser
      .post('/books/update/1')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});

describe('GET /books/destroy/:id', () => {
  it('respond with http', (done) => {
    authenticatedUser
      .get('/books/destroy/1')
      .set('Accept', 'text/html')
      .expect(200, done);
  });
});

describe('POST /books/update', () => {
  it('no http page', (done) => {
    authenticatedUser
      .post('/books/destroy/1')
      .set('Accept', 'text/html')
      .expect(404, done);
  });
});
