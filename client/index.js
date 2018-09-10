import {
  initMap,
  geocodeAddress
} from './google'


var selectedId;
var location;

var tripItemTemplate = (
  `<li class="js-trip-item">
      <div class="trip-title">
        <p><span class="trip-item-name js-trip-item-name"></span></p>
        <p><span class="trip-item-location js-trip-item-location"></span></p>
        <p><span class="trip-item-dates js-trip-item-dates"></span></p>
      </div>

      <div class="trip-controls">
  
        <button class="js-trip-item-delete">
          <span class="button-label">Delete</span>
        </button>

        <button class="js-trip-item-view">
          <span class="button-label">View</span>
        </button>

      <div>
     
    </li>`
);

//const { DATABASE_URL, PORT } = require('../config');
var serverBase = "//localhost:8080/";
var TRIP_LIST_URL = serverBase + 'trip-list';

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
  }).then(() => {
    $(".popup-overlay-new-trip, .popup-content-new-trip").removeClass("active");
    $(".box-parent").removeClass("inactive");

    $('#js-new-name').val('');
    $('#js-new-location').val('');
    $('#js-new-textArea').val('');
    $('#js-new-dates').val('');
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

/////////////////////////////////////////////////////////
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

}
/////////////////////////////////////////////////////////////
function handleAddPlace() {
  $('main').on('click', '.js-trip-item-addPlace', function (e) {
    e.preventDefault();
    $('.popup-overlay-upd-trip, .popup-content-upd-trip').removeClass("active");
    $('.popup-overlay-add-place, .popup-content-add-place').addClass("active");
    $(".box-parent").addClass("inactive");
    $('.popup-content-add-place').html(`        
        <form id="js-add-place-form">
        <label for="js-add-place-form"><span> <h2>Please add place you have visited in ${location} </h2> </span></label>
        <input type="text" name="js-trip-place-name" id="js-place-name" placeholder="Twin Peaks, Golden Gate Bridge ...."><br>
        
        <button type="submit" id="addPlace">Save place</button>
        
        <button class="js-trip-addPlace-close">
        <span class="button-label">Close</span>
        </button>

        </form>
    `);
  });

}

function handleCloseAddPlaceView() {
  $('main').on('click', '.js-trip-addPlace-close', function (e) {
    e.preventDefault();
    $('.popup-overlay-add-place, .popup-content-add-place').removeClass("active");
    $('.popup-overlay-upd-trip, .popup-content-upd-trip').addClass("active");

  });
}

function handleSaveNewPlace(){
  $('main').on('click', '#addPlace', function (e) {
    e.preventDefault();
    

    
  });
}
///////////////////////////////////////////////////////////////

function hadleViewTrip() {
  $('main').on('click', '.js-trip-item-view', function (e) {
    e.preventDefault();
    $('.popup-overlay-view-fullTrip, .popup-content-view-fullTrip').addClass("active");
    $(".box-parent").addClass("inactive");

    var element = $(e.currentTarget).closest(".js-trip-item");
    var item;
    $.getJSON(TRIP_LIST_URL, function (items) {
      item = items.find(item => item.id === element.attr("id"));
      
      var convertedFullDate = convertDateFromMongoDB(item.tripDates);
      item.tripDates = convertedFullDate;
      updateViewFullTrip(item);
    });

  });

}

function updateViewFullTrip(item) {
  $('.popup-content-view-fullTrip').html(`        
  <div id="full-trip-view">
  <p><span class="trip-item js-full-trip-name">${item.name}</span></p>
  <p><span class="trip-item js-full-trip-location">${item.location}</span></p>
  <p><span class="trip-item js-full-trip-dates"></span>${item.tripDates}</p>
  <p><span class="trip-item js-full-trip-content"></span>${item.content}</p>
  </div>


  <div class="full-trip-controls">

  <button class="js-trip-item-edit">
    <span class="button-label">Edit</span>
  </button>

  <button class="js-trip-item-close">
      <span class="button-label">Close</span>
  </button>

<div>

`);
}

function handleCloseFullView() {
  $('main').on('click', '.js-trip-item-close', function (e) {
    e.preventDefault();
    $(".popup-overlay-view-fullTrip, .popup-content-view-fullTrip").removeClass("active");
    $(".box-parent").removeClass("inactive");
  });
}


///////////////////////////////////////////////////////////////
function handleTripEdit() {
  $('main').on('click', '.js-trip-item-edit', function (e) {
    e.preventDefault();
    $(".popup-overlay-view-fullTrip, .popup-content-view-fullTrip").removeClass("active");
    $(".box-parent").removeClass("inactive");

    var name = $("#full-trip-view").find(".js-full-trip-name").text();


    $.getJSON(TRIP_LIST_URL, function (items) {
      var item = items.find(item => item.id === selectedId);
      getTripFormWithDetails(item);
      //saveUpdatedTrip(item.id);
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



function saveUpdatedTrip(tripId) {

  //$("#js-upd-trip-form").submit(function (e) {
    $("#js-upd-trip-form").on("click", "#updatetrip", function(e) {
      e.preventDefault();

    //var element = $(e.currentTarget).closest(".js-trip-item");
    var item = {
      id: tripId,
      name: $('#js-upd-trip-form').find('input[name="js-upd-trip-form-name"]').val(),
      location: $('#js-upd-trip-form').find('input[name="js-upd-trip-form-location"]').val(),
      content: $('#js-upd-trip-form').find('textarea').val(),
      tripDates: $('#js-upd-trip-form').find('input[name="js-upd-trip-form-dates"]').val(),
    };

    var mongoFormatDate = item.tripDates;
    item.tripDates = convertDateIntoMongoDB(mongoFormatDate);

    
    console.log(TRIP_LIST_URL + "/" + item.id);

    console.log("Updating trip item `" + item.id + "`");

    if(selectedId === item.id){
      runAjax(item)
      ;}

  });

}
function runAjax(item){
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
    updateViewFullTrip(item);
    $(".popup-overlay-view-fullTrip, .popup-content-view-fullTrip").addClass("active");
  });
}

function handleCloseEditView() {
  $('main').on('click', '.js-trip-upd-close', function (e) {
    e.preventDefault();
    $(".popup-overlay-upd-trip, .popup-content-upd-trip").removeClass("active");
    $(".popup-overlay-view-fullTrip, .popup-content-view-fullTrip").addClass("active");
    //$(".box-parent").removeClass("inactive");
  });
}
//////////////////////////////////////////////////////////////
function handleSelectTrip() {
  var prevElement;

  $('main').on('click', '.trip-title', function (e) {
    e.preventDefault();

    var element = $(e.currentTarget).closest(".js-trip-item");
    selectedId =element.attr("id");

    if (!prevElement) {
      var currentElement = $(e.currentTarget).closest(".js-trip-item");
      location = currentElement.find(".js-trip-item-location").text();
      currentElement.find(".trip-controls").addClass("active");
      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: location,
            key: 'AIzaSyDqKYCI1XhXLez68nZki75U4Nizx0Au6v8'
          }
        })
        .then(
          function (response) {
            geocodeAddress(response);

          })
        .catch(function (error) {
          console.log(error);
        });
      prevElement = currentElement;

    } else if (prevElement !== currentElement) {
      prevElement.find(".trip-controls").removeClass("active");
      var currentElement = $(e.currentTarget).closest(".js-trip-item");
      location = currentElement.find(".js-trip-item-location").text();
      currentElement.find(".trip-controls").addClass("active");

      axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
            address: location,
            key: 'AIzaSyDqKYCI1XhXLez68nZki75U4Nizx0Au6v8'
          }
        })
        .then(
          function (response) {
            geocodeAddress(response);

          })
        .catch(function (error) {
          console.log(error);
        });
      prevElement = currentElement;
    }

  });

}


///////////////////////////////////////////////////////////////
function convertDateIntoMongoDB(mongoFormatDate){
  var array = mongoFormatDate.split('-');
  var startDate = new Date(array[0]);
  var endDate = new Date(array[1]);
  var tripDates = {
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true}
  }
  tripDates.startDate = startDate;
  tripDates.endDate = endDate;
  return tripDates;
}

function convertDateFromMongoDB(mongoFormatDate){
  var array = mongoFormatDate.split('/');
  var startDate = new Date(array[0]);
  var endDate = new Date(array[1]);
  var convertedStartDate = `${startDate.getMonth()+1}/${startDate.getDate()}/${startDate.getFullYear()}`
  var convertedEndDate = `${endDate.getMonth()+1}/${endDate.getDate()}/${endDate.getFullYear()}`
  var convertedFullDate =`${convertedStartDate} - ${convertedEndDate}`;
  return convertedFullDate;
}

//////////////////////////////////////////////////////////////
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
})