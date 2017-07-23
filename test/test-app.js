var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

var options = {
  url: 'http://localhost:3000',
  headers: {
    'Content-Type': 'text/plain'
  }
};

function getCookie(res) {
  return res.headers['set-cookie'][0].split(';')[0];
}

describe('Login', function() {
  it('should show login page on /users/login GET', function(done) {
    chai.request(app).get('/users/login').end(function(err, res) {
      res.should.have.status(200);
      done();
    });
  });
  it('should redirect to /users/login', function(done) {
    chai.request(app).get('/').end(function(err, res) {
      res.should.have.status(200);
      expect(res).to.redirect;
      expect('Location', '/users/login');
      done();
    });
  });
  it('should render login form', function(done) {
    chai.request(app).get('/users/login').end(function(err, res) {
      expect(200, /<form/);
      done();
    });
  });
  it('should display login error', function(done) {
    chai
      .request(app)
      .post('/users/login')
      .type('urlencoded')
      .send('username=not-username&password=foobar')
      .end(function(err, res) {
        expect(302, function(err, res) {
          if (err) return done(err);
          chai.request(app).get('/users/login').set('Cookie', getCookie(res)).expect(200, /Authentication failed/);
        });
        done();
      });
  });
});

describe('Logout', function() {
  it('should redirect to /users/login', function(done) {
    chai
      .request(app)
      .post('/users/login')
      .type('urlencoded')
      .send('username=username&password=password')
      .end(function(err, res) {
        chai.request(app).get('/users/logout');
        expect('Location', '/');
        expect(302);
        expect('Location', '/users/login');
        done();
      });
  });
});

it('should redirect to /users/login', function(done) {
  chai.request(app).get('/').end(function(err, res) {
    res.should.have.status(200);
    expect(res).to.redirect;
    expect('Location', '/users/login');
    done();
  });
});

describe('auth', function() {
  describe('GET /', function() {
    it('should redirect to /users/login without cookie', function(done) {
      chai.request(app).get('/').end(function(err, res) {
        expect('Location', '/users/login');
        expect(302, /Authentication failed/);
        done();
      });
    });

    it('should succeed with proper cookie', function(done) {
      chai
        .request(app)
        .post('/users/login')
        .type('urlencoded')
        .send('username=username&password=password')
        .end(function(err, res) {
          expect('Location', '/');
          expect(302, function(err, res) {
            if (err) return done(err);
            chai.request(app).get('/logout').set('Cookie', getCookie(res)).expect(200);
          });
          done();
        });
    });
    it('should succeed with proper cookie', function(done) {
      chai
        .request(app)
        .post('/users/login')
        .type('urlencoded')
        .send('username=username&password=password')
        .end(function(err, res) {
          expect('Location', '/');
          expect(302, function(err, res) {
            if (err) return done(err);
            chai.request(app).get('/logout').set('Cookie', getCookie(res)).expect(302, done);
          });
          done();
        });
    });
  });

  describe('POST /users/login', function() {
    it('should fail without proper username', function(done) {
      chai
        .request(app)
        .post('/users/login')
        .type('urlencoded')
        .send('username=not-username&password=password')
        .end(function(err, res) {
          expect('Location', '/users/login');
          expect(302);
          done();
        });
    });

    it('should fail without proper password', function(done) {
      chai
        .request(app)
        .post('/users/login')
        .type('urlencoded')
        .send('username=username&password=not-password')
        .end(function(err, res) {
          expect('Location', '/users/login');
          expect(302);
          done();
        });
    });

    it('should succeed with proper credentials', function(done) {
      chai
        .request(app)
        .post('/users/login')
        .type('urlencoded')
        .send('username=username&password=password')
        .end(function(err, res) {
          expect('Location', '/');
          expect(302);
          done();
        });
    });
  });
});
