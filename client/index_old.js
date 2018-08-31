import { addTrip, MOCK_TRIPS } from './api'


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

function renderTripForm() {
  $('#addtrip').on('click', function (event) {
    $('.popup-overlay, .popup-content').addClass("active");
    $(".box-parent").addClass("inactive");
  });
  renderTripList(MOCK_TRIPS);
}


function getTripFormDetails(e) {
  return {
    name: $(e.currentTarget).find('#js-new-name').val(),
    location: $(e.currentTarget).find('#js-new-location').val(),
    content: $(e.currentTarget).find('#js-new-textArea').val(),
    dates: $(e.currentTarget).find('#js-new-dates').val()
  }
}

function renderTripList(items){
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
    itemDates.text(item.publishDate);

      return element;
    });
    $('.js-trip-list').html(itemElements);

}

function saveNewTrip() {
  $("#js-add-trip-form").submit(function (e) {
    e.preventDefault();
    const formDetails = getTripFormDetails(e);
    addTrip(formDetails)
      .then(trips => {
        console.log(trips);
        renderTripList(trips);
      })
      .then(()=>{
        $(".popup-overlay, .popup-content").removeClass("active");
        $(".box-parent").removeClass("inactive");
      })
  });
}


function deleteTrip(tripId){
  console.log('Deleting trip `' + tripId + '`');
  
  //MOCK_TRIPS.splice( list.indexOf(''), 1 );
  

}

function handleTripDelete() {
  $('main').on('click','.js-trip-item-delete', function(e) {
    e.preventDefault();
    deleteTrip(
      $(e.currentTarget).closest('.js-trip-item').attr('id'));
  });
}


$(renderTripForm);
$(saveNewTrip);
