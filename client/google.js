
export function initMap() {
    var lastItem
var serverBase = "//localhost:8080/";
var TRIP_LIST_URL = serverBase + 'trip-list';

$.getJSON(TRIP_LIST_URL, function (items) {
   
         lastItem = items[0];
         console.log(lastItem.location);
}).then((lastItem)=>{
    console.log(lastItem[0].location);
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: lastItem[0].location,
          key: 'AIzaSyDqKYCI1XhXLez68nZki75U4Nizx0Au6v8'
        }
      })
        .then(
            function(response){geocodeAddress(response)
          })
        .catch(function (error) {
          console.log(error);
        });
    
    });

}

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
        const map = new google.maps.Map(document.getElementById('map'), {
          center: {
              lat: Number(lat),
              lng: Number(lng)
          },
          zoom: 12
        });
  
}