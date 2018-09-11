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
  it('creates a new trip', async () => {
    await ListTrips.create({
      name: 'Weekends in Las-Vegas',
      content: 'Can not believe how much fun I am having',
      location: 'Las-Vegas, NV',
      tripDates: '06/21/2018 - 06/24/2018'
    });

    const count = await ListTrips.count();
    const trip = await ListTrips.findOne();

    expect(count).to.equals(1);
    expect(trip.name).to.contains('Weekends');
    expect(trip.startDate).to.equals(new Date('06/21/2018'))
    expect(trip.endDate).to.equals(new Date('06/24/2018'))
  })
})

describe('createPlaceForTrip', () => {
  it('adds place to a trip', async () => {
    const trip =await ListTrips.create({
      name: "Vacation in Moscow",
      location: "Moscow,Russia",
      content: "Best place for family vacation",
      tripDates: "05/05/2015-05/10/2015",
      publishDate: Date.now()
    });

    await createPlaceForTrip(trip.id, {name: 'Red Square, Moscow'});

    const trip = await ListTrips.findOne();
    expect(trip.places.length).to.equals(1);
    expect(trip.places[0].name).to.equals('Red Square, Moscow');
  })
})

function createPlaceForTrip(tripId, place) {

  $.post(`/trip-list/${tripId}/places`, place);

  const itemPlace = {
    place: place,
    lat: lat,
    lng: lng
  }
}
