import { strict as assert } from 'assert';
import http from 'http';
import server from '../server.js';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';

describe('Reservation API', () => {
  let token;
  let reservationId;
  let catwayId = '11';

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

  // Créer une réservation
  it('should create a reservation', (done) => {
    const req = http.request({
      method: 'POST',
      host: 'localhost',
      port: 3000,
      path: `/api/catway/${catwayId}/reservations`,
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
        assert.equal(data.clientName, 'John Doe');
        reservationId = data._id;
        done();
      });
    });

    req.write(JSON.stringify({ clientName: 'John Doe', boatName: 'L\'Étoile des Mers', checkIn: '2024-12-01', checkOut: '2024-12-10' }));
    req.end();
  });

  // Supprimer une réservation
  it('should delete a reservation', (done) => {
    const req = http.request({
      method: 'DELETE',
      host: 'localhost',
      port: 3000,
      path: `/api/catway/${catwayId}/reservations/${reservationId}`,
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
        assert.equal(data.msg, 'La réservation a été supprimée avec succès');
        done();
      });
    });

    req.end();
  });
});
