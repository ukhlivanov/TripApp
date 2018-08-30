'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const tripPostSchema = mongoose.Schema({
  tripName: {type: String, required: true},
  tripLocation: {type: String, required: true},
  tripDateStart: {type: Date, required: true},
  tripDateEnd: {type: Date, required: true},
  content: {type: String},
});
