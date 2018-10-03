import {
  initMap,
  geocodeAddress,
  getCoordsOfPlace,
  displayPlaceOnMap
} from './google'



export var selectedId;
var location;
var userId;
//var serverBase = "//localhost:8080/";
const { serverBase } = require('../config');
var TRIP_LIST_URL = serverBase + getUserId() + '/trip-list';

//Template for trip item///////////////////////////////////////////////////////
var tripItemTemplate = (
  `<li class="js-trip-item">
      <div class="trip-title">
        <p><span class="trip-item-name js-trip-item-name"></span></p>
        <p><span class="trip-item-location js-trip-item-location"></span></p>
        <p><span class="trip-item-dates js-trip-item-dates"></span></p>
      </div>

      <div class="trip-controls">


        <button title="View comments" class="trip-item-view js-trip-item-view">
          <img src="img/view.png" />
        </button>

        <button  title="Add place" class="trip-item-add">
          <img src="img/add.png" />
        </button>

        <button  title="Edit" class="trip-item-edit js-trip-item-edit">
          <img src="img/edit.png" />
        </button>

        <button  title="Delete" class="trip-item-delete js-trip-item-delete">
          <img src="img/delete.png" />
        </button>

      <div>
     
    </li>`
);
//-End Block-//////////////////////////////////////////////////////////////////



// Get userId from URL////////////////////////////////////////////////////////
function getUserId() {
  const location = window.location;
  var array = location.search.split('=');
  $.getJSON(TRIP_LIST_URL, function (items) {
    if(items.length!==0){
      renderSelectedMap(items[0].location);
    } else{
      $('.popup-overlay-new-trip, .popup-content-new-trip').addClass("active");
      $(".box-parent").addClass("inactive");
    }

  })
  userId = array[1];
  return array[1];
}
console.log("USERID: ", getUserId());
//-End Block-//////////////////////////////////////////////////////////////////

// Loading Initial/updated list of trips///////////////////////////////////////
function getAndDisplayTripList() {
  console.log('Retrieving trip list');
  $.getJSON(TRIP_LIST_URL, function (items) {
    console.log('Rendering trip list');
    console.log(items);
    var itemElements = items.map(function (item) {

      console.log(item);

      var element = $(tripItemTemplate);
      element.attr('id', item.id);

      var itemName = element.find('.js-trip-item-name');
      itemName.text(item.name);

      var itemLocation = element.find('.js-trip-item-location');
      itemLocation.text(item.location);

      var itemTripDates = element.find('.js-trip-item-dates');
      var convertedItemTripDates = convertDateFromMongoDB(item.tripDates);
      itemTripDates.text(convertedItemTripDates);
      return element;
    });

    $('.js-trip-list').html(itemElements);
    
  });
}
//-End Block-//////////////////////////////////////////////////////////////////

//Adding new trip item/////////////////////////////////////////////////////////

function handleCloseNewTripForm() {
  $('main').on('click', '.canceltrip', function (e) {
    e.preventDefault();
    $(".popup-overlay-new-trip, .popup-content-new-trip").removeClass("active");
    $(".box-parent").removeClass("inactive");
  });
}

function renderTripForm() {
  $('#js-trip-item-add').on('click', function () {
    $('.popup-overlay-new-trip, .popup-content-new-trip').addClass("active");
    $(".box-parent").addClass("inactive");
  });
}

function addTripItem(item) {
  $.ajax({
    method: "POST",
    url: TRIP_LIST_URL,
    data: JSON.stringify(item),
    success: function () {
      getAndDisplayTripList();
    },
    dataType: "json",
    contentType: "application/json"
  }).then(() => {
    console.log("Adding trip: " + item);
    getAndDisplayTripList();
    renderSelectedMap(item.location);

    $.getJSON(TRIP_LIST_URL, function (items) {
      selectedId = items[0].id;
    })
    $(".popup-overlay-new-trip, .popup-content-new-trip").removeClass("active");
    $(".box-parent").removeClass("inactive");

    $('#js-new-name').val('');
    $('#js-new-location').val('');
    $('#js-new-textArea').val('');
    $('#js-new-dates').val('');
  }).then(()=>{   
    $('.popup-overlay-view-addPlaceForm, .popup-content-view-addPlaceForm').addClass("active");
    $(".box-parent").addClass("inactive");
    renderAddPlaceForm();
  });

}

function handleTripListAdd() {
  renderTripForm();
  $("#js-add-trip-form").submit(function (e) {
    e.preventDefault();
    const item = getTripFormDetails(e);
    item.tripDates = convertDateIntoMongoDB(item.tripDates);
    addTripItem(item);
  });
}

function getTripFormDetails(e) {
  return {
    name: $(e.currentTarget).find('#js-new-name').val(),
    location: $(e.currentTarget).find('#js-new-location').val(),
    content: $(e.currentTarget).find('#js-new-textArea').val(),
    tripDates: $(e.currentTarget).find('#js-new-dates').val()
  }
}
function renderAddPlaceForm(){
  $('.popup-content-view-addPlaceForm').html(`        
    <h3>Please, add place you have visited </h3>
    <div class="addPlaceForm-controls">
  
    <button class="button js-trip-item-addPlace">
      Add
    </button>
  
    <button class="button js-trip-item-skipAddTrip">
       Skip
    </button>
  
  <div>
`);
}
function handleSkipAddPlaceForm() {
  $('main').on('click', '.js-trip-item-skipAddTrip', function (e) {
    $(".popup-overlay-view-addPlaceForm, .popup-content-view-addPlaceForm").removeClass("active");
    $(".box-parent").removeClass("inactive");
  });
}
//-End Block-//////////////////////////////////////////////////////////////////

//Delete trip item////////////////////////////////////////////////////////////
function deletetrip(tripId) {
  console.log('Deleting trip `' + tripId + '`');
  $.ajax({
    url: TRIP_LIST_URL + '/' + tripId,
    method: 'DELETE',
    success: getAndDisplayTripList
  });

}

function handleTripDelete() {
  $('main').on('click', '.js-trip-item-delete', function (e) {
    e.preventDefault();
    deletetrip(
      $(e.currentTarget).closest('.js-trip-item').attr('id'));

  });

  $.getJSON(TRIP_LIST_URL, function (items) {
    if(items.length!==0){
      renderSelectedMap(items[0].location);
    }
  })
}
//-End Block-//////////////////////////////////////////////////////////////////

//Create(add) place you have been visited ////////////////////////////////////
function handleAddPlace() {
  $('main').on('click', '.js-trip-item-addPlace, .trip-item-add', function (e) {
    e.preventDefault();
    $('.popup-overlay-view-addPlaceForm, .popup-content-view-addPlaceForm').removeClass("active");
    $('.popup-overlay-add-place, .popup-content-add-place').addClass("active");
    $(".box-parent").addClass("inactive");
    addPlaceForm();
  });

}

function addPlaceForm(){
  $('.popup-content-add-place').html(`        
  <form id="js-add-place-form">
  <label for="js-add-place-form"><span> <h4>Please add place you have visited in ${location} </h4> </span></label>
  <input type="text" name="js-trip-place-name" id="js-place-name" placeholder="Golden Gate Bridge, San Francisco ...." required><br>
  
  <button type="submit" class="button" id="addPlace">
    Add
  </button>
  
  <button class="button js-trip-addPlace-close">
    Cancel
  </button>

  </form>
`);
}

function handleCloseAddPlaceView() {
  $('main').on('click', '.js-trip-addPlace-close', function (e) {
    e.preventDefault();
    $('.popup-overlay-add-place, .popup-content-add-place').removeClass("active");
    $(".box-parent").removeClass("inactive");

  });
}
const saveAndRenderMarker = function (place) {
  return function (response) {
    const lat = response.data.results[0].geometry.location.lat;
    const lng = response.data.results[0].geometry.location.lng;

    const itemPlace = {
      name: place,
      lat: lat,
      lng: lng
    }

    $.ajax({
      method: "POST",
      url: TRIP_LIST_URL+`/${selectedId}/places`,
      data: JSON.stringify(itemPlace),
      success: function () {
        getAndDisplayTripList();
      },
      dataType: "json",
      contentType: "application/json"
    })

    displayPlaceOnMap(itemPlace);
    $('.popup-overlay-add-place, .popup-content-add-place').removeClass("active");
    $('.popup-overlay-view-oneMorePlace, .popup-content-view-oneMorePlace').addClass("active");
    $('.popup-content-view-oneMorePlace').html(`        
    <div id="js-add-oneMorePlace">

    <h2>Add one more place?</h2>
    
    <button type="submit" class= "button" id="addOneMorePlace">
      Yes
    </button>
    
    <button class="button js-trip-addOneMorePlace-cancel">
      No
    </button>

    </div>
    `);
  };
}

function handleAddOneMorePlace(){
  $('main').on('click', '#addOneMorePlace', function (e) {
    e.preventDefault();
    $(".popup-overlay-view-oneMorePlace, .popup-content-view-oneMorePlace").removeClass("active");
    $('.popup-overlay-add-place, .popup-content-add-place').addClass("active");
    $('#js-place-name').val('');
    //$(".box-parent").removeClass("inactive");
  });
  addPlaceForm();
}

function handleCancelAddOneMorePlace(){
  $('main').on('click', '.js-trip-addOneMorePlace-cancel', function (e) {
    e.preventDefault();
    $(".popup-overlay-view-oneMorePlace, .popup-content-view-oneMorePlace").removeClass("active");
    $(".box-parent").removeClass("inactive");
  });

}
window.saveAndRenderMarker = saveAndRenderMarker;
function handleSaveNewPlace() {
  $('main').on('click', '#addPlace', function (e) {
    e.preventDefault();
    var place = $('#js-add-place-form').find('input[name="js-trip-place-name"]').val();
 
    getCoordsOfPlace(place)
      .then(saveAndRenderMarker(place))
      .catch(function (error) {
         console.log(error);
      });
  });
}
//-End Block-//////////////////////////////////////////////////////////////////

// View(edit) trip comments //////////////////////////////////////////////////
function hadleViewTrip() {
  $('main').on('click', '.js-trip-item-view', function (e) {
    e.preventDefault();
    $('.popup-overlay-view-fullTrip, .popup-content-view-fullTrip').addClass("active");
    $(".box-parent").addClass("inactive");

    var element = $(e.currentTarget).closest(".js-trip-item");
    var item;
    $.getJSON(TRIP_LIST_URL, function (items) {
      item = items.find(item => item.id === element.attr("id"));
      updateViewFullTrip(item);
    });

  });
}

function updateViewFullTrip(item) {
  $('.popup-content-view-fullTrip').html(`        
  <div id="full-trip-view">
    <p><span class="trip-item js-full-trip-content"></span>${item.content}</p>
  </div>
  <div class="full-trip-controls">
  <button class="button js-trip-item-editcontent">
    Edit
  </button>
  <button class="button js-trip-item-close">
    Cancel
  </button>
<div>
`);
}

function handleContentEdit() {
  $('main').on('click', '.js-trip-item-editcontent', function (e) {
    e.preventDefault();
    
    $.getJSON(TRIP_LIST_URL, function (items) {
      var item = items.find(item => item.id === selectedId);
      getContentFormWithDetails(item);
      saveUpdatedContent(item);
    });
  });    
}
function handleCloseFullView() {
  $('main').on('click', '.js-trip-item-close', function (e) {
    e.preventDefault();
    $(".popup-overlay-view-fullTrip, .popup-content-view-fullTrip").removeClass("active");
    $(".box-parent").removeClass("inactive");
  });
}
//-End Block-//////////////////////////////////////////////////////////////////

// Edit trip item /////////////////////////////////////////////////////////////
function handleTripEdit() {
  $('main').on('click', '.js-trip-item-edit', function (e) {
    e.preventDefault();
    $.getJSON(TRIP_LIST_URL, function (items) {
      var item = items.find(item => item.id === selectedId);
      getTripFormWithDetails(item);
    });
    saveUpdatedTrip(selectedId);
  });
}

function getTripFormWithDetails(item) {
  $('#js-upd-trip-form').find('#js-upd-name').val(item.name);
  $('#js-upd-trip-form').find('#js-upd-location').val(item.location);
  $('#js-upd-trip-form').find('#js-upd-textArea').val(item.content);
  var convertedTripDates = convertDateFromMongoDB(item.tripDates);
  $('#js-upd-trip-form').find('#js-upd-dates').val(convertedTripDates);

  $('.popup-overlay-upd-trip, .popup-content-upd-trip').addClass("active");
  $(".box-parent").addClass("inactive");
}

function getContentFormWithDetails(item) {
  $('#js-upd-content-form').find('#js-upd-textArea').val(item.content);
  $('.popup-overlay-view-fullTrip, .popup-content-view-fullTrip').removeClass("active");

  $('.popup-overlay-view-content, .popup-content-view-content').addClass("active");
  $(".box-parent").addClass("inactive");
}


function saveUpdatedContent(item){

  $("#js-upd-content-form").on("click", "#updatecontent", function (e) {
    e.preventDefault();
      
    var newItem = {
      id: item.id,
      name: item.name,
      location: item.location,
      content: $('#js-upd-content-form').find('textarea').val(),
      tripDates: item.tripdates
    }
    console.log(TRIP_LIST_URL + "/" + newItem.id);

    console.log("Updating trip item `" + newItem.id + "`");
    console.log(newItem);

    if (selectedId === newItem.id) {
      runAjax(newItem);
      $(".popup-overlay-view-content, .popup-content-view-content").removeClass("active");
      $(".box-parent").removeClass("inactive");
    }

  });
}

function saveUpdatedTrip(tripId) {
  $("#js-upd-trip-form").on("click", "#updatetrip", function (e) {
    e.preventDefault();
    var item = {
      id: tripId,
      name: $('#js-upd-trip-form').find('input[name="js-upd-trip-form-name"]').val(),
      location: $('#js-upd-trip-form').find('input[name="js-upd-trip-form-location"]').val(),
      tripDates: $('#js-upd-trip-form').find('input[name="js-upd-trip-form-dates"]').val(),
    };
    console.log(item.content);
    var mongoFormatDate = item.tripDates;
    item.tripDates = convertDateIntoMongoDB(mongoFormatDate);
    console.log(TRIP_LIST_URL + "/" + item.id);
    console.log("Updating trip item `" + item.id + "`");
    if (selectedId === item.id) {
      runAjax(item);  
    }
  });
}

function runAjax(item) {
  $.ajax({
      url: TRIP_LIST_URL + "/" + item.id,
      method: "PUT",
      data: JSON.stringify(item),
      success: function (data) {
        getAndDisplayTripList();
      },
      dataType: "json",
      contentType: "application/json"
    })
    .then(() => {
      $(".popup-overlay-upd-trip, .popup-content-upd-trip").removeClass("active");
      $(".box-parent").removeClass("inactive");
      $('#js-upd-name').val('');
      $('#js-upd-location').val('');
      $('#js-upd-textArea').val('');
      $('#js-upd-dates').val('');
    })
    .then(() => {
      console.log("Updating trip list: " + item);
      getAndDisplayTripList();
      var mongoFormatDate = `${item.tripDates.startDate}/${item.tripDates.endDate}`;
      item.tripDates = convertDateFromMongoDB(mongoFormatDate);
    });
}

function handleCloseEditView() {
  $('main').on('click', '.js-trip-upd-close', function (e) {
    e.preventDefault();
    $(".popup-overlay-view-content, .popup-content-view-content").removeClass("active");
    $(".popup-overlay-upd-trip, .popup-content-upd-trip").removeClass("active");
    $(".box-parent").removeClass("inactive");
  });
}
//-End Block-//////////////////////////////////////////////////////////////////

//Handle on selected trip event ///////////////////////////////////////////////
function handleSelectTrip() {
  var prevElement;
  $('main').on('click', '.trip-title', function (e) {
    e.preventDefault();
    var element = $(e.currentTarget).closest(".js-trip-item");
    selectedId = element.attr("id");
    showPlaces(selectedId);
    if (!prevElement) {
      var currentElement = $(e.currentTarget).closest(".js-trip-item");
      location = currentElement.find(".js-trip-item-location").text();
      currentElement.find(".trip-controls").addClass("active");
      renderSelectedMap(location);
      prevElement = currentElement;
    } else if (prevElement !== currentElement) {
      prevElement.find(".trip-controls").removeClass("active");
      var currentElement = $(e.currentTarget).closest(".js-trip-item");
      location = currentElement.find(".js-trip-item-location").text();
      currentElement.find(".trip-controls").addClass("active");

      renderSelectedMap(location);
      prevElement = currentElement;
    }
  });
}

function renderSelectedMap(location){
  axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: location,
            key: 'AIzaSyBpvjt5zBq23Wu6eZHvVuAHEjxd1GgDbMg'
          }
        })
        .then(
          function (response) {
            geocodeAddress(response);

          })
        .catch(function (error) {
          console.log(error);
        });
}

//-End Block-//////////////////////////////////////////////////////////////////


//Functions converting and saving trip dates with MongoDB//////////////////////
export function convertDateIntoMongoDB(mongoFormatDate) {
  var array = mongoFormatDate.split('-');
  var startDate = new Date(array[0]);
  var endDate = new Date(array[1]);
  var tripDates = {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  }
  tripDates.startDate = startDate;
  tripDates.endDate = endDate;
  return tripDates;
}

export function convertDateFromMongoDB(mongoFormatDate) {
  var array = mongoFormatDate.split('/');
  var startDate = new Date(array[0]);
  var endDate = new Date(array[1]);
  var convertedStartDate = `${startDate.getMonth()+1}/${startDate.getDate()}/${startDate.getFullYear()}`
  var convertedEndDate = `${endDate.getMonth()+1}/${endDate.getDate()}/${endDate.getFullYear()}`
  var convertedFullDate = `${convertedStartDate} - ${convertedEndDate}`;
  return convertedFullDate;
}
//-End Block-//////////////////////////////////////////////////////////////////

//Function for show up markers(places on Google Maps)//////////////////////////
export function showPlaces(selectedId){
  $.getJSON(TRIP_LIST_URL, function (items) {
    var item = items.find(item => item.id === selectedId);
      for(let i=0; i<item.places.length; i++){
        displayPlaceOnMap(item.places[i]);
      }
  });
}
//-End Block-//////////////////////////////////////////////////////////////////

window.initMap = initMap;

$(function () {
  getAndDisplayTripList();
  handleTripDelete();
  handleSelectTrip();
  handleTripListAdd();
  handleTripEdit();
  handleAddPlace();
  hadleViewTrip();
  handleCloseFullView();
  handleCloseEditView();
  handleCloseAddPlaceView();
  handleSaveNewPlace();
  handleSkipAddPlaceForm();
  handleAddOneMorePlace();
  handleCancelAddOneMorePlace();
  handleContentEdit();
  handleCloseNewTripForm();
})