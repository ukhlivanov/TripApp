const MOCK_TRIPS = [{
  name: 'Highway to SF',
  location: 'SF, California',
  startDate: '2010-01-01',
  endDate: '2010-01-15'
}]

function addTrip({ name, location, dates }) {
  const newTrip = {
    name,
    location,
    dates: dates.split(',')
  }
  MOCK_TRIPS.push(newTrip);
  //https://www.promisejs.org
  // var ajaxPromise = Promise.resolve($.ajax('/data.json'));
  return Promise.resolve(MOCK_TRIPS);
}

module.exports = { addTrip }