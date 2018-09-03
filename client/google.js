
export function initMap() {
var new_lat;
var new_lng;
var formattedAddress;
var serverBase = "//localhost:8080/";
var TRIP_LIST_URL = serverBase + 'trip-list';

$.getJSON(TRIP_LIST_URL, function (items) {
        lastItem = items[0];
}).then((lastItem)=>{
 
    console.log(lastItem[0].location);
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: lastItem[0].location,
          key: 'AIzaSyDqKYCI1XhXLez68nZki75U4Nizx0Au6v8'
        }
      })
        .then(function (response) {
          // Log full response
          console.log(response);
    
          // Formatted Address
          formattedAddress = response.data.results[0].formatted_address;
    
          // Geometry
          new_lat = response.data.results[0].geometry.location.lat;
          new_lng = response.data.results[0].geometry.location.lng;
    
          console.log(new_lat);
          console.log(new_lng);
          console.log(formattedAddress);
          const map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: Number(new_lat),
                lng: Number(new_lng)
            },
            zoom: 12
          });
    
        })
        .catch(function (error) {
          console.log(error);
        });
    
    });

}

export function geocodeAddress(address) {

}