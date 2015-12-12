var Map = function(size) {
    this.size = size;
    this.airSpaces = [];
    this.relief = [];
    this.oneLevelHeight = 1
}

/**
 * Randomize map
 *
 * @param {integer|null} levelWidth
 * @param {integer|null} levelHeight
 *
 * @return {boolean}
 */
Map.prototype.shuffleAirSpaces = function(levelWidth, levelHeight) {
    // if (typeof levelWidth === 'undefined' || levelHeight === 0) {
    //     levelWidth = this.size.width;
    // }
    // if (typeof levelHeight === 'undefined') {
    //     levelHeight = 10; // default
    // }
    // FUCK OFF!
    this.airSpaces = [new AirSpace(
        new Point(0, 0),
        new Vektor(
            Math.random() * 100 * 2 - 100,
            0// Math.random() * this.size.height * 2 - this.size.height
        ),
        this.size,
        new Temperature(30) // ?
    )];
    // for (var i = 0; i < this.size )
}

Map.prototype.shuffleRelief = function() {
    this.relief = [];
    for (var x = 0; x < this.size.width; x += getRandomInt(10, 100)) {
        this.relief.push(new Point(x, getRandomInt(0, 50)));
    }
}

Map.prototype.findAirSpace = function(point) {
    for (var i in this.airSpaces) {
        var airSpace = this.airSpaces[i];

        if (airSpace.space.containsPoint(point)) {
            return airSpace;
        }
    }

    throw new Error('Point ' + point.toString() + ' is out of map range');
}