
const mongoose = require('mongoose')

const server = 'ds251112.mlab.com:51112'
const database = 'trips'
const user = 'tripuser'
const password = 'qwe321$'

mongoose.connect(`mongodb://${user}:${password}@${server}/${database}`)

const SchemaListTrips =  mongoose.Schema({
  name: String,
  location: String,
  dates: [{
    startDate: Date,
    endDate: Date,
  }],
  content: String,
  publishDate: Date
});

SchemaListTrips.virtual('dates').get(function() {
  return `${this.dates.startDate} ${this.dates.endDate}`.trim();});

SchemaListTrips.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    location: this.location,
    content: this.content,
    dates: this.dates,
    publishDate: this.publishDate
  };
};


const ListTrips = mongoose.model('Trip', SchemaListTrips)

module.exports = {
  ListTrips
}