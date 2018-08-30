
var MOCK_STATUS_UPDATES = {
	"statusUpdates": [
        {
            "id": "1111111",
            "content": "Can't believe how much fun I'm having.",
            "tripName": "Vacation in Canada",
            "location": "Canada",
            "startDate": 1470016976609,
            "endDate": 1470016976609
        },
        {
            "id": "2222222",
            "content": "Can't believe how much fun I'm having.",
            "tripName": "Vacation in Mexico",
            "location": "Canada",
            "startDate": 1470016976609,
            "endDate": 1470016976609
        },
        {
            "id": "33333333",
            "content": "Can't believe how much fun I'm having.",
            "tripName": "Vacation in Florida,USA",
            "location": "Canada",
            "startDate": 1470016976609,
            "endDate": 1470016976609
        },
        {
            "id": "4444444",
            "content": "Can't believe how much fun I'm having.",
            "tripName": "Vacation in Europe",
            "location": "Canada",
            "startDate": 1470016976609,
            "endDate": 1470016976609
        },
    ]
};


function getRecentStatusUpdates() {

	setTimeout( function(){ 
    
        app.get('/trips', (req, res) => {
            Trip
              .find()
              .then(trips => {
                res.json(MOCK_STATUS_UPDATES);
              })
              .catch(err => {
                console.error(err);
                res.status(500).json({ error: 'something went terribly wrong' });
              });
          });
    
    }, 1000);
}


function displayStatusUpdates(data) {
    for (index in data.statusUpdates) {
	   $('body').append(
        '<p>' + data.statusUpdates[index].text + '</p>');
    }
}


function getAndDisplayStatusUpdates() {
	getRecentStatusUpdates(displayStatusUpdates);
}


$(function() {
	getAndDisplayStatusUpdates();
})