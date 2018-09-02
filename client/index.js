import { addTrip } from './api'

var tripItemTemplate = (
    `<li class="js-trip-item">
      <p><span class="trip-item js-trip-item-name"></span></p>
      <p><span class="trip-item js-trip-item-location"></span></p>
      <p><span class="trip-item js-trip-item-content"></span></p>
      <p><span class="trip-item js-trip-item-dates"></span></p>
      
      <div class="trip-item-controls">
  
        <button class="js-trip-item-edit">
          <span class="button-label">Edit</span>
        </button>
  
        <button class="js-trip-item-delete">
          <span class="button-label">Delete</span>
        </button>
  
      </div>
    </li>`
  );
  var serverBase = "//localhost:8080/";
  var TRIP_LIST_URL = serverBase + 'trip-list';
  
  function getAndDisplayTripList() {
    console.log('Retrieving trip list');
    $.getJSON(TRIP_LIST_URL, function(items) {
      console.log('Rendering trip list');
  
      var itemElements = items.map(function(item) {
      
        console.log(item);
        
        var element = $(tripItemTemplate);
        element.attr('id', item.id);
    
        var itemName = element.find('.js-trip-item-name');
        itemName.text(item.name);
    
        var itemLocation = element.find('.js-trip-item-location');
        itemLocation.text(item.location);
    
        var itemContent = element.find('.js-trip-item-content');
        itemContent.text(item.content);
    
        var itemDates = element.find('.js-trip-item-dates');
        itemDates.text(item.dates);
    
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


  function addTripItem(item){
    $.ajax({
      method: "POST",
      url: TRIP_LIST_URL,
      data: JSON.stringify(item),
      success: function() {
        getAndDisplayTripList();
      },
      dataType: "json",
      contentType: "application/json"
    }).then(()=>{
      console.log("Adding trip: " + item);
      getAndDisplayTripList();
    }).then(()=>{
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
    addTripItem(item);
  });
}

function getTripFormDetails(e) {
  return {
    name: $(e.currentTarget).find('#js-new-name').val(),
    location: $(e.currentTarget).find('#js-new-location').val(),
    content: $(e.currentTarget).find('#js-new-textArea').val(),
    dates: $(e.currentTarget).find('#js-new-dates').val()
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
  $('main').on('click','.js-trip-item-delete', function(e) {
    e.preventDefault();
    deletetrip(
      $(e.currentTarget).closest('.js-trip-item').attr('id'));
  });
}

///////////////////////////////////////////////////////////////



function handleTripEdit(){
  $('main').on('click','.js-trip-item-edit', function(e) {
    e.preventDefault();
    var element = $(e.currentTarget).closest(".js-trip-item");
    var item = {
      id: element.attr("id"),
      name: element.find(".js-trip-item-name").text(),
      location: element.find(".js-trip-item-location").text(),
      content: element.find(".js-trip-item-content").text(),
      dates: element.find(".js-trip-item-dates").text()
    };
    
    getTripFormWithDetails(item);
    saveUpdatedTrip(element.attr("id"));
  });
}



function getTripFormWithDetails(item) {
  $('#js-upd-trip-form').find('#js-upd-name').val(item.name);
  $('#js-upd-trip-form').find('#js-upd-location').val(item.location);
  $('#js-upd-trip-form').find('#js-upd-textArea').val(item.content);
  $('#js-upd-trip-form').find('#js-upd-dates').val(item.dates);

  $('.popup-overlay-upd-trip, .popup-content-upd-trip').addClass("active");
  $(".box-parent").addClass("inactive");
}


function saveUpdatedTrip(tripId){

  $("#js-upd-trip-form").submit(function (e) {
    e.preventDefault();
    var element = $(e.currentTarget).closest(".js-trip-item");
    var item = {
      id: tripId,
      name: $('#js-upd-trip-form').find('input[name="js-upd-trip-form-name"]').val(),
      location: $('#js-upd-trip-form').find('input[name="js-upd-trip-form-location"]').val(),
      content: $('#js-upd-trip-form').find('textarea').val(),
      dates: $('#js-upd-trip-form').find('input[name="js-upd-trip-form-dates"]').val(),
    };

    console.log(item);
    console.log("Updating trip item `" + item.id + "`");
    $.ajax({
      url: TRIP_LIST_URL + "/" + item.id,
      method: "PUT",
      data: JSON.stringify(item),
      success: function(data) {
        getAndDisplayTripList();
      },
      dataType: "json",
      contentType: "application/json"
    }).then(()=>{
      $(".popup-overlay-upd-trip, .popup-content-upd-trip").removeClass("active");
      $(".box-parent").removeClass("inactive");
      $('#js-upd-name').val('');
      $('#js-upd-location').val('');
      $('#js-upd-textArea').val('');
      $('#js-upd-dates').val('');
    }).then(()=>{
      console.log("Updating trip list: " + item);
      getAndDisplayTripList();
    });
    
  });
  
}  

  $(function() {
    getAndDisplayTripList();
    handleTripDelete();
    handleTripListAdd();
    handleTripEdit();
  })
  