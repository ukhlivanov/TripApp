const chai = require('chai');
const expect = chai.expect;
chai.use(expect);
const {
  ListTrips
} = require('../server/model')
const mongoose = require('mongoose');


describe('creating trips', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost/tripAppTests')
  })
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  })
  it.only('creates a new trip', async () => {
    await ListTrips.create({
      name: 'Weekends in Las-Vegas',
      content: 'Can not believe how much fun I am having',
      location: 'Las-Vegas, NV',
      dates: '06/21/2018 - 06/24/2018'
    });

    const count = await ListTrips.count();
    const trip = await ListTrips.findOne();

    expect(count).to.equals(1);
    expect(trip.name).to.contains('Weekends');
    expect(trip.startDate).to.equals(new Date('06/21/2018'))
    expect(trip.endDate).to.equals(new Date('06/24/2018'))
  })
})