'use strict';
const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

const SchemaListTrips =  mongoose.Schema({
  name: {type: String, required: true},
  location: {type: String, required: true},
  tripDates: {
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
  },
  content: {type: String, required: true},
  publishDate: {type: Date, default: Date.now},

});

SchemaListTrips.virtual('tripDatesString').get(function() {
  return this.tripDates.startDate + '/' + this.tripDates.endDate;
  //return `${this.tripDates.startDate} ${this.tripDates.endDate}`.trim()

});

SchemaListTrips.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    location: this.location,
    content: this.content,
    tripDates: this.tripDatesString,
    publishDate: this.publishDate
  };
};


const ListTrips = mongoose.model('ListTrips', SchemaListTrips);
module.exports = { ListTrips };