class LocationManager {
  constructor(gameEngine) {
    this.locations = null;
    this.id = "";
    this.name = "";
    this.description = "";
    this.items = [];
    this.engine = gameEngine;
  }

  addItemsToLocation(items) {
    this.findLocationById(this.id).items.push(...items);
  }

  itemExistInLocation(item) {
    return this.items.includes(item);
  }

  findLocationById(id) {
    return this.locations.find(location => location.id === id);
  }

  removeLocationItem(itemid) {
    this.findLocationById(this.id).items.splice(this.items.indexOf(itemid), 1)
  }


  async init(location) {
    this.locations = location;
    this.engine.log("Loading Location...", "fgGreen");
  }

  async loadMap(mapId) {
    const location = this.findLocationById(mapId);
    if (location) {
      this.id = location.id;
      this.name = location.name;
      this.items = location.items;
      this.description = location.description;
    }
  }
}

module.exports = LocationManager
