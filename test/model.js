const chai = require('chai');
const expect = chai.expect;
chai.use(expect);

const {
  ListTrips,
  createPlaceForTrip
} = require('../server/model')
const mongoose = require('mongoose');
const {
  dateEqual
} = require("./helpers");




describe('model', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost/tripAppTests')
  })
  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
  })
  it('creates a new trip', async () => {

    const item = {
      name: 'Weekends in Las-Vegas',
      content: 'Can not believe how much fun I am having',
      location: 'Las-Vegas, NV',
      tripDates: '06/21/2018-06/24/2018'

    }

    const tmpDateIntoMongoDB = convertDateIntoMongoDB(item.tripDates);
    item.tripDates = tmpDateIntoMongoDB;

    await ListTrips.create(item);

    const count = await ListTrips.count();
    const trip = await ListTrips.findOne();

    const tmpDateFromMongoDB = trip.tripDates.startDate + '/' + trip.tripDates.endDate;
    trip.tripDates = convertDateFromMongoDB(tmpDateFromMongoDB);


    console.log(trip);
    expect(count).to.equals(1);
    expect(trip.name).to.contains('Weekends');
    dateEqual(trip.tripDates.startDate, new Date('06/21/2018'));
    dateEqual(trip.tripDates.endDate, new Date('06/24/2018'));
  })

  describe('createPlaceForTrip', () => {
    it('adds place to a trip', async () => {
      let trip = await ListTrips.create({
        name: "Vacation in Moscow",
        location: "Moscow,Russia",
        content: "Best place for family vacation",
        tripDates: {
          startDate: "05/05/2015",
          endDate: "05/10/2015"
        },
        publishDate: Date.now()
      });

      await createPlaceForTrip(trip.id, {
        name: 'Red Square, Moscow'
      });

      trip = await ListTrips.findOne();
      expect(trip.places.length).to.equals(1);
      expect(trip.places[0].name).to.equals('Red Square, Moscow');
    })
  })
})



function convertDateIntoMongoDB(mongoFormatDate) {
  var array = mongoFormatDate.split('-');
  var startDate = new Date(array[0]);
  var endDate = new Date(array[1]);
  var tripDates = {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  }
  tripDates.startDate = startDate;
  tripDates.endDate = endDate;
  return tripDates;
}

function convertDateFromMongoDB(mongoFormatDate) {
  var array = mongoFormatDate.split('/');
  var startDate = new Date(array[0]);
  var endDate = new Date(array[1]);
  var convertedStartDate = `${startDate.getMonth()+1}/${startDate.getDate()}/${startDate.getFullYear()}`
  var convertedEndDate = `${endDate.getMonth()+1}/${endDate.getDate()}/${endDate.getFullYear()}`
  var convertedFullDate = `${convertedStartDate} - ${convertedEndDate}`;
  return convertedFullDate;
}