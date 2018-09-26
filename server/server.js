'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const { DATABASE_URL, PORT } = require('../config');
const  tripListRouter  = require("./tripListRouter");


const app = express();
const path = require('path');

app.use(morgan('common'));
app.use(express.json());
app.use(express.static("client"));
app.use(express.static("dist"));

const authWithUrl = (req, res, next) => {
  req.user_id = req.params.user_id;
  next();
}



app.use("/:user_id/trip-list", [authWithUrl,tripListRouter])

app.get("/:user_id", (req, res) => {
  console.log('sending static file')
    const indexHtml = path.join(__dirname, '../client/main.html')
    res.sendFile(indexHtml);
  });
  



app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found!' });
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };
