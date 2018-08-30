import { addTrip } from './api'

function renderTripForm() {
  $('#addtrip').on('click', function (event) {
    $('.popup-overlay, .popup-content').addClass("active");
    $(".box-parent").addClass("inactive");
  });
}


function getTripFormDetails(form) {
  return {
    dates: form['js-add-trip-form-dates'].value,
    name: form['js-add-trip-form-name'].value,
    location: form['js-add-trip-form-location'].value
  }
}
function saveNewTrip() {
  $("#js-add-trip-form").submit(function (event) {
    event.preventDefault();
    const formDetails = getTripFormDetails(event.target);
    addTrip(formDetails)
      .then(trips => {
        console.log(trips);
      })
  });
}



$(renderTripForm);
$(saveNewTrip);
