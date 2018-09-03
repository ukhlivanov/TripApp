const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { ListTrips } = require('./model');

ListTrips.create(
  'Weekends in San-Francisco',
  'Can not believe how much fun I am having',
  'San-Francisco, CA',
  '05/24/2018 - 05/27/2018',
);
ListTrips.create(
  'Weekends in Las-Vegas',
  'Can not believe how much fun I am having',
  'Las-Vegas, NV',
  '06/21/2018 - 06/24/2018',
);
ListTrips.create(
  'Weekends in Sacramento',
  'Can not believe how much fun I am having',
  'Sacramento, CA',
  '06/21/2018 - 06/24/2018',
);





router.get('/', (req, res) => {
  res.json(ListTrips.get());
});

router.delete('/:id', (req, res) => {
  console.log(req.params);
  //Method Delete from model
  ListTrips.delete(req.params.id);
  console.log(`Deleted trip list item \`${req.params.ID}\``);
  res.status(204).end();
});

router.post('/', jsonParser, (req, res) => {
  console.log(req.body);
  const requiredFields = ['name', 'content', 'location', 'dates'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = ListTrips.create(req.body.name, req.body.content, req.body.location, req.body.dates);
  res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'name', 'content', 'location', 'dates'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id }) and request body id ``(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(req.params);
   console.log(`Updating trip item \`${req.params.id}\``);
  
   const item = ListTrips.update({
     id: req.params.id,
     name: req.body.name,
     location: req.body.location,
     content: req.body.content,
     dates: req.body.dates
  });
  console.log("ITEM" + "  " + item);

  res.status(204).json(item);
})
module.exports = router;
