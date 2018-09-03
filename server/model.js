const uuid = require('uuid');


function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

const Trips = {
    create: function(name, content, location, dates) {
      console.log("Creating new trip list item");
      const item = {
        id: uuid.v4(),
        name: name,
        location: location,
        dates: dates,
        content: content
      };
      this.items[item.id] = item;
      return item;
    },
    get: function() {
      console.log("Retrieving trip list items");
      return Object.keys(this.items).map(key => this.items[key]);

    },
    delete: function(id) {
      console.log(`Deleting shopping list item \`${id}\``);
      delete this.items[id];
    },
    update: function(updatedItem) {
      console.log(`Updating trip list item \`${updatedItem.id}\``);
      const { id } = updatedItem;
      if (!(id in this.items)) {
        throw StorageException(
          `Can't update item \`${id}\` because doesn't exist.`
        );
      }
      this.items[updatedItem.id] = updatedItem;
      return updatedItem;
    }
  };
  
  function createTripsModel() {
    const storage = Object.create(Trips);
    storage.items = {};
    return storage;
  }

  module.exports = {ListTrips: createTripsModel()};