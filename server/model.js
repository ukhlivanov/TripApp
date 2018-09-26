'use strict';
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

const SchemaListTrips = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  tripDates: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
  },
  content: {
    type: String
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  places: [{
    name: String,
    lat: String,
    lng: String
  }],
  userId: {
    type: String,
    required: true
  }
});



SchemaListTrips.virtual('tripDatesString').get(function () {
  return this.tripDates.startDate + '/' + this.tripDates.endDate;
});


SchemaListTrips.methods.serialize = function () {
  return {
    id: this._id,
    name: this.name,
    location: this.location,
    content: this.content,
    tripDates: this.tripDatesString,
    publishDate: this.publishDate,
    places: this.places,
    userId: this.userId
  };
};

function createPlaceForTrip(tripId, {name,lat,lng}) {

  const itemPlace = {
    name,
    lat,
    lng
  }
  
  return ListTrips.findById(tripId)
    .then(item => {
      console.log(item);
      item.places.push(itemPlace);
      return item.save();
    })    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went horribly wrong'
      });
    });
}


const ListTrips = mongoose.model('ListTrips', SchemaListTrips);
module.exports = {
  ListTrips,
  createPlaceForTrip
};