/* eslint-env jasmine */

// routing テスト
const request = require('supertest');
const jwt = require('jsonwebtoken');
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
describe('POST /api/auth/', () => {
  it('should be 404 not found', (done) => {
    request(app)
      .get('/api/')
      .expect(404, done);
  });
  it('should unauthorized access with unloggined user', (done) => {
    request(app)
      .get('/api/books/')
      .expect(401, done);
  });
  it('should success login with correct user', (done) => {
    request(app)
      .post('/api/auth/')
      .send(userCredentials)
      .expect(200, done);
  });
  it('should deny login with wrong email', (done) => {
    request(app)
      .post('/api/auth/')
      .send(wrongEmailCredentials)
      .expect(401, done);
  });
  it('should deny login with wrong password', (done) => {
    request(app)
      .post('/api/auth/')
      .send(wrongPasswordCredentials)
      .expect(401, done);
  });
  it('should deny login using by wrong user id', (done) => {
    const opts = {
      issuer: 'accounts.example.co.jp',
      audience: 'https://node40-node006.herokuapp.com/',
      expiresIn: '1h',
    };
    const token = jwt.sign({ id: 65535 }, 'testkey', opts);
    request(app)
      .get('/api/books/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(401, done);
  });
});

describe('with Login', () => {
  // store a jwt token
  let jwt_token;

  beforeAll((done) => {
    request(app)
      .post('/api/auth/')
      .send(userCredentials)
      .end((err, res) => {
        jwt_token = res.body.token;
        done();
      });
  });

  describe('GET /api/books/', () => {
    it('respond with REST', (done) => {
      request(app)
        .get('/api/books/')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect(200, done);
    });
  });

  describe('GET /api/books/:id', () => {
    it('respond with REST', (done) => {
      request(app)
        .get('/api/books/1')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect(200, done);
    });
  });

  describe('POST /api/books/create', () => {
    it('respond with REST', (done) => {
      request(app)
        .post('/api/books/create')
        .send({ book_title: 'test', user_id: 1 })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect(201, done);
    });
  });

  describe('PATCH /api/books/:id', () => {
    it('respond with REST', (done) => {
      request(app)
        .patch('/api/books/1')
        .send({ book_title: 'update', user_id: 1 })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect(201, done);
    });
  });

  describe('DELETE /books/:id', () => {
    it('respond with REST', (done) => {
      let book_info;
      request(app)
        .post('/api/books/create')
        .send({ book_title: 'for delete' })
        .set('Authorization', `Bearer ${jwt_token}`)
        .end((err, res) => {
          book_info = JSON.parse(res.text);
          request(app)
            .delete(`/api/books/${book_info.id}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${jwt_token}`)
            .expect(204, done);
        });
    });
  });

  describe('DELETE /books/:id', () => {
    it('respond with REST', (done) => {
      request(app)
        .delete('/api/books/1')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect(409, done);
    });
  });

  describe('DELETE /api/books/-1', () => {
    it('record not found', (done) => {
      request(app)
        .delete('/api/books/-1')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect(404, done);
    });
  });
});
