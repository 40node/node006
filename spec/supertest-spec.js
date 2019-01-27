/* eslint-env jasmine */

// routing テスト
const request = require('supertest-session');
const app = require('../app');

//let's set up the data we need to pass to the login method
const userCredentials = {
  email: 'tak@oshiire.to',
  password: 'password'
};
const wrongEmailCredentials = {
  email: 'foo',
  password: 'password'
};
const wrongPasswordCredentials = {
  email: 'tak@oshiire.to',
  password: 'foo'
};

//now let's login the user before we run any tests
const authenticatedUser = request(app);

describe('POST /login', () => {
  it('should redirect to / with unloggined user', (done) => {
    request(app)
      .get('/books/')
      .expect(302)
      .expect('Location', '/', done);
  });
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
});

describe('with Login', () => {
  let jwt_token;

  beforeAll((done) => {
    request(app)
      .post('/login')
      .send(userCredentials)
      .end((err, res) => {
        jwt_token = res.body.token;
        done();
      });
  });

  describe('GET /api/books/', () => {
    it('respond with http', (done) => {
      request(app)
        .get('/api/books/')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /api/books/:id', () => {
    it('respond with REST', (done) => {
      request(app)
        .get('/api/books/1')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect('Content-Type', /json/)
        .expect(200, {
          id: 1,
          book_title: 'シェルスクリプトマガジン vol.54',
          author: 'しょっさん',
          publisher: 'USP研究所',
          user_id: 1,
          image_uml: 'https://uec.usp-lab.com/INFO/IMG/SHELLSCRIPTMAG_VOL54.JPG'
        }, done);
    });
  });

  describe('POST /api/books/create', () => {
    it('respond with REST', (done) => {
      request(app)
        .post('/api/books/create')
        .send({ book_title: 'test', user_id: 1 })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect('Content-Type', /json/)
        .expect(200, {
          book_title: 'test',
          user_id: 1
        }, done);
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
});

describe('GET /logout', () => {
  beforeAll((done) => {
    authenticatedUser
      .post('/login')
      .send(userCredentials)
      .expect(302, done);
  });

  it('should go back to login', (done) => {
    authenticatedUser
      .get('/logout')
      .set('Accept', 'text/html')
      .expect(302)
      .expect('Location', '/', done);
  });
});