

const { serverBase } = require('../config');
var TRIP_LIST_URL = serverBase + 'trip-list';

export function initMap() {
  var lastItem;
  $.getJSON(TRIP_LIST_URL, function (items) {

    lastItem = items[0];
    console.log(lastItem.location);
  }).then((lastItem) => {
    console.log(lastItem[0].location);
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: lastItem[0].location,
          key: 'AIzaSyBpvjt5zBq23Wu6eZHvVuAHEjxd1GgDbMg'
        }
      })
      .then(
        function (response) {
          geocodeAddress(response)
        })
      .catch(function (error) {
        console.log(error);
      });

  });

}

export var map;
export function geocodeAddress(response) {

  // Log full response
  console.log(response);

  // Formatted Address
  var formattedAddress = response.data.results[0].formatted_address;

  // Geometry
  var lat = response.data.results[0].geometry.location.lat;
  var lng = response.data.results[0].geometry.location.lng;

  console.log(lat);
  console.log(lng);
  console.log(formattedAddress);
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: Number(lat),
      lng: Number(lng)
    },
    zoom: 12
  });
}

export function getCoordsOfPlace(place) {
  return axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
    params: {
      address: place,
      key: 'AIzaSyBpvjt5zBq23Wu6eZHvVuAHEjxd1GgDbMg'
    }
  })
}

export function displayPlaceOnMap(itemPlace) {

  var marker = new google.maps.Marker({
    position: {
      lat: Number(itemPlace.lat),
      lng: Number(itemPlace.lng)
    },
    map: map,
    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
  });
}