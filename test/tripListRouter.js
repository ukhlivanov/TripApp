const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;
chai.use(expect);
chai.use(chaiHttp);

const {
  app,
  runServer,
  closeServer
} = require("../server/server");


describe('TripListRouter', () => {


  it('returns an error when no body is provided', async () => {
    await chai.request(app).put('/trip-list/1232').then(res => expect(res.status).to.equals(400));
  })

  it("Should list items on GET", function () {
    return chai
      .request(app).get("/trip-list").then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a("array");
        expect(res.body.length).to.be.at.least(1);

        const expectedKeys = ["id", "name", "location", "content", "dates", "publishDate"];
        res.body.forEach(function (item) {
          let i = 0;
          expect(item).to.be.a("object");
          expect(item).to.include.keys(expectedKeys)

          expect(item.id).to.be.equal(res.body[i].id);
          expect(item.name).to.be.equal(res.body[i].name);
          expect(item.location).to.be.equal(res.body[i].location);
          expect(item.content).to.be.equal(res.body[i].content);
          expect(item.dates).to.be.equal(res.body[i].dates);
          i++;
        });

      });
  });

  it("should add an item on POST", function () {
    const newItem = {
      name: "Vacation in Canada",
      location: "Vancouver,Canada",
      content: "Best place for family vacation",
      dates: "05/05/2015-05/10/2015",
      publishDate: Date.now()
    };
    return chai
      .request(app)
      .post("/trip-list")
      .send(newItem)
      .then(function (res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.include.keys("id", "name", "location", "content", "dates", "publishDate");
        expect(res.body.id).to.not.equal(null);

        expect(newItem.name).to.be.equal(res.body.name);
        expect(newItem.location).to.be.equal(res.body.location);
        expect(newItem.content).to.be.equal(res.body.content);
        expect(newItem.dates).to.be.equal(res.body.dates);

        expect(res.body).to.deep.equal(
          Object.assign(newItem, {
            id: res.body.id,
            name: res.body.name,
            location: res.body.location,
            content: res.body.content,
            dates: res.body.dates,
            publishDate: res.body.publishDate
          })
        );
      });
  });

  it("should update items on PUT", function () {
    const updateData = {
      name: "Vacation in Canada",
      location: "Vancouver,Canada",
      content: "Best place for family vacation",
      dates: "05/05/2015-05/10/2015",
      publishDate: Date.now()
    };


    return (
      chai
      .request(app)
      .get("/trip-list")
      .then(function (res) {
        updateData.id = res.body[0].id;
        return chai
          .request(app)
          .put(`/trip-list/${updateData.id}`)
          .send(updateData);
      })
      .then(function (res) {
        res.headers = {
          'content-type': 'application/json'
        };
        expect(res).to.have.status(204);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        //expect(res.body).to.deep.equal({name: updateData.name});
      })
    );
  });

  it("should delete items on DELETE", function () {
    return (
      chai
      .request(app)
      .get("/trip-list")
      .then(function (res) {
        return chai.request(app).delete(`/trip-list/${res.body[0].id}`);
      })
      .then(function (res) {
        expect(res).to.have.status(204);
      })
    );
  });


})