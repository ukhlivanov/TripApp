const uuid = require('uuid');


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const Trips = {
  create: function(name, content, location, dates) {
    const trip = {
      id: uuid.v4(),
      name: name,
      location: location,
      dates: dates,
      publishDate: Date.now(),
      content: content
    };
    this.trips.push(trip);
    return trip;
  },

  get: function(id=null) {

    if (id !== null) {
      return this.trips.find(trip => trip.id === id);
    }
    // return trips sorted (descending) by
    // publish date
    return this.trips.sort(function(a, b) {
      return b.publishDate - a.publishDate
    });
  },
  delete: function(id) {
    const tripIndex = this.trips.findIndex(
      trip => trip.id === id);
    if (tripIndex > -1) {
      this.trips.splice(tripIndex, 1);
    }
  },
  update: function(updatedTrip) {
    const {id} = updatedTrip;
    const tripIndex = this.trips.findIndex(
      trip => trip.id === updatedtrip.id);
    if (tripIndex === -1) {
      throw new StorageException(
        `Can't update item \`${id}\` because doesn't exist.`)
    }
    this.trips[tripIndex] = Object.assign(
      this.trips[tripIndex], updatedtrip);
    return this.trips[tripIndex];
  }
};

function createTripsModel() {
  const storage = Object.create(Trips);
  storage.trips = [];
  return storage;
}


module.exports = {ListTrips: createTripsModel()};
