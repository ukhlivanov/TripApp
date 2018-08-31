/*"use strict";

const express = require("express");

const app = express();

app.use(express.static("client"));
app.use(express.static("dist"));

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function () {
    console.info(`App listening on ${this.address().port}`);
  });
}

module.exports = app;*/

const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.json());

const tripListRouter = require("./tripListRouter");


// log the http layer
app.use(morgan("common"));

app.use(express.static("client"));
app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});


app.use("/trip-list", tripListRouter);


let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on("error", err => {
        reject(err);
      });
  });
}


function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
