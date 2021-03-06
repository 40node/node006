/* eslint-env jasmine */

// routing テスト
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');

// JWT環境変数の取り込み
require('dotenv').config({
  path: '../config/environments/.env.' + app.get('env')
});
let opts = {
  issuer: process.env.ISSUER,
  audience: process.env.AUDIENCE,
  expiresIn: process.env.EXPIRES,
};
const secret = process.env.SECRET;

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
const noPasswordCredentials = {
  email: 'tak@oshiire.to',
  password: ''
};

//now let's login the user before we run any tests
describe('POST /api/auth/', () => {
  const unauthorized = (token, done) => {
    request(app)
      .get('/api/books/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(401, done);
  };

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
  it('should deny login with no password', (done) => {
    request(app)
      .post('/api/auth/')
      .send(noPasswordCredentials)
      .expect(401, done);
  });
  it('should deny login using by wrong user id', (done) => {
    const token = jwt.sign({ id: 65535 }, secret, opts);
    unauthorized(token, done);
    /*
    request(app)
      .get('/api/books/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(401, done);
      */
  });
  it('should deny login using algorithm is none', (done) => {
    opts.algorithm = 'none';
    const token = jwt.sign({ id: 1 }, secret, opts);
    unauthorized(token, done);
    /*
    request(app)
      .get('/api/books/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .expect(401, done);
      */
  });
  /*  it('should deny no login user', (done) => {
      const token = jwt.sign({ id: 65535 }, secret, opts);
      request(app)
        .get('/api/books/1')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .expect(401, done);
    });
    */
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
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /api/books/:id', () => {
    it('respond getting a content with REST', (done) => {
      request(app)
        .get('/api/books/1')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /api/books/:id', () => {
    it('respond no content with REST', (done) => {
      request(app)
        .get('/api/books/a')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          if (res.text === {}) return done(Error('I expect getting no value'));
          done();
        });
    });
  });

  describe('POST /api/books/', () => {
    it('respond success with REST', (done) => {
      request(app)
        .post('/api/books/')
        .send({ book_title: 'test' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect(201, done);
    });
  });
  describe('POST /api/books/', () => {
    it('respond error with REST', (done) => {
      request(app)
        .post('/api/books/')
        .send({ author: 'test' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect(400, done);
    });
  });

  describe('PUT /api/books/:id', () => {
    it('respond success with REST', (done) => {
      request(app)
        .put('/api/books/1')
        .send({ book_title: 'update' })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${jwt_token}`)
        .expect(201)
        .end((err, res) => {
          const text = JSON.parse(res.text);
          if (err) return done(err);
          if (text.id !== 1) return done(Error('should get id eq 1'));
          done();
        });
    });
  });

  describe('DELETE /books/:id', () => {
    it('respond success with REST', (done) => {
      let book_info;
      request(app)
        .post('/api/books/')
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
    it('respond error with REST', (done) => {
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
