import { strict as assert } from 'assert';
import http from 'http';
import server from '../server.js';
import User from '../models/User.js';

describe('Auth API', () => {
  before(async () => {
    await User.deleteMany();
    await new User({ name: 'UserTest', email: 'emailtest@test.com', password: 'passwordtest' }).save();
  });


  // Créer un utilisateur
  it('should register a user', (done) => {
    const req = http.request({
      method: 'POST',
      host: 'localhost',
      port: 3000,
      path: '/api/auth/signup',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const data = JSON.parse(body);
        assert.equal(res.statusCode, 200);
        assert.equal(typeof data, 'object');
        assert.ok(data.token);
        done();
      });
    });

    req.write(JSON.stringify({ name: 'UserTest', email: 'emailtest@test.com', password: 'passwordtest' }));
    req.end();
  });

  // Connexion utilisateur
  it('should login a user', (done) => {
    const req = http.request({
      method: 'POST',
      host: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const data = JSON.parse(body);
        assert.equal(res.statusCode, 200);
        assert.equal(typeof data, 'object');
        assert.ok(data.token);
        done();
      });
    });

    req.write(JSON.stringify({ email: 'emailtest@test.com', password: 'passwordtest' }));
    req.end();
  });

  // Supprimer un utilisateur
  it('should delete a user', (done) => {
    const reqLogin = http.request({
      method: 'POST',
      host: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const data = JSON.parse(body);
        const token = data.token;

        const reqDelete = http.request({
          method: 'DELETE',
          host: 'localhost',
          port: 3000,
          path: '/api/auth/delete',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            const responseData = JSON.parse(body);
            assert.equal(res.statusCode, 200);
            assert.equal(responseData.msg, 'L\'utilisateur a été supprimé avec succès');
            done();
          });
        });

        reqDelete.end();
      });
    });

    reqLogin.write(JSON.stringify({ email: 'emailtest@test.com', password: 'passwordtest' }));
    reqLogin.end();
  });

});
