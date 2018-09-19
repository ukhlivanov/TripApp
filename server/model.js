'use strict';
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

const SchemaListTrips = mongoose.Schema({
  user: {
    type: String,
    required: true
  },

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
  }]
});



SchemaListTrips.virtual('tripDatesString').get(function () {
  return this.tripDates.startDate + '/' + this.tripDates.endDate;
  //return `${this.tripDates.startDate} ${this.tripDates.endDate}`.trim()

});


SchemaListTrips.methods.serialize = function () {
  return {
    id: this._id,
    user: this.user,
    name: this.name,
    location: this.location,
    content: this.content,
    tripDates: this.tripDatesString,
    publishDate: this.publishDate,
    places: this.places
  };
};


function createPlaceForTrip(tripId, {name, lat,lng}) 
{
  const itemPlace = {
    name,
    lat,
    lng
  }

  return ListTrips.findById(tripId)
    .then(item => {
      item.places.push(itemPlace);
      return item.save();
    })
}


const ListTrips = mongoose.model('ListTrips', SchemaListTrips);
module.exports = {
  ListTrips,
  createPlaceForTrip
};