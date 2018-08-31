const MOCK_TRIPS = [{
  name: 'Highway to SF',
  location: 'SF, California',
  startDate: '2010-01-01',
  endDate: '2010-01-15',
  content: 'Can not believe how much fun I am having'
}]

function addTrip({ name, location, dates, content }) {
  const newTrip = {
    name,
    location,
    dates: dates.split(','),
    content
  }
  MOCK_TRIPS.push(newTrip);
  //https://www.promisejs.org
  // var ajaxPromise = Promise.resolve($.ajax('/data.json'));
  return Promise.resolve(MOCK_TRIPS);
}

module.exports = { addTrip, MOCK_TRIPS }