import { strict as assert } from 'assert';
import http from 'http';
import server from '../server.js';
import User from '../models/User.js';
import Catway from '../models/Catway.js';

describe('Catway API', () => {
  let token;
  let catwayId;

  before((done) => {
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
        token = data.token;
        done();
      });
    });

    reqLogin.write(JSON.stringify({ email: 'emailtest@test.com', password: 'passwordtest' }));
    reqLogin.end();
  });

  // Créer un catway
  it('should create a new catway', (done) => {
    const req = http.request({
      method: 'POST',
      host: 'localhost',
      port: 3000,
      path: '/api/catway',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const data = JSON.parse(body);
        assert.equal(res.statusCode, 200);
        assert.equal(typeof data, 'object');
        assert.equal(data.catwayNumber, '11');
        catwayId = data._id;
        done();
      });
    });

    req.write(JSON.stringify({ catwayNumber: '11', type: 'short', catwayState: 'disponible' }));
    req.end();
  });

  // Supprimer un catway
  it('should delete a catway', (done) => {
    const req = http.request({
      method: 'DELETE',
      host: 'localhost',
      port: 3000,
      path: `/api/catway/${catwayId}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const data = JSON.parse(body);
        assert.equal(res.statusCode, 200);
        assert.equal(data.msg, 'Le catway a été supprimé avec succès');
        done();
      });
    });

    req.end();
  });

});
