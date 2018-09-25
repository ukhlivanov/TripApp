const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {
  ListTrips,
  createPlaceForTrip
} = require('./model');

var serverBase = "//localhost:8080/";
var TRIP_LIST_URL = serverBase + 'trip-list';

//GET
function getUserId(req) {
 
  return req.user_id;
}
router.get('/', (req, res) => {

  ListTrips.find({userId: getUserId(req)}).then(trips => {
    trips.sort(function (a, b) {
      return b.publishDate - a.publishDate
    });
    const tripsJson = trips.map(trip => trip.serialize())
    res.json(tripsJson);
  }).catch(err => {
    console.error(err);
    res.status(500).json({
      error: 'something went terribly wrong'
    });
  });
});

//GET by ID
router.get('/:trip_id', (req, res) => {
  ListTrips.findOne({ id: req.params.id, userId: getUserId(req) }).then(trip => {
    res.json(trip.serialize())
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: 'something went horribly wrong'
        });
      });
  });
});

//CREATE TRIP
router.post('/', jsonParser, (req, res) => {

  const requiredFields = ['name', 'location', 'content', 'tripDates'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  console.log(req.body);
  ListTrips.create({
      userId: getUserId(req),
      name: req.body.name,
      location: req.body.location,
      content: req.body.content,
      tripDates: req.body.tripDates,
      publishDate: Date.now()
    }).then(trip => res.status(201).json(trip.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong'
      });
    });
});

//CREATE TRIP PLACES
//const user_id = getUserId();
// console.log(user_id);
router.post('/:id/places', (req, res) => {

  const requiredFields = ['name', 'lat', 'lng'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }



  createPlaceForTrip(req.params.id, req.body)
    .then(() => {
      res.status(201).json({
        message: 'success'
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went horribly wrong'
      });
    });
});


//DELETE
router.delete('/:id', (req, res) => {
  ListTrips
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({
        message: 'success'
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went terribly wrong'
      });
    });
});



//UPDATE
router.put('/:id', jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({
      message: message
    });
  }

  const updated = {};
  const updateableFields = ['name', 'location', 'content', 'tripDates'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  ListTrips
    .findByIdAndUpdate(req.params.id, {
      $set: updated
    }, {
      new: true
    })
    .then(updatedTrip => res.status(204).end())
    .catch(err => res.status(500).json({
      message: 'Something went wrong'
    }));

})


module.exports = router;