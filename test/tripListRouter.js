const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(expect);
chai.use(chaiHttp);


const { app } = require('../server/server');

describe('TripListRouter', () => {
  describe("update", () => {
    it('returns an error when no body is provided', async () => {
      await chai.request(app).put('/trip-list/1232').then(res => expect(res.status).to.equals(400));
    })
  })
})