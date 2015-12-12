var TEMPERATURE_COEF_NEAR_FLAME = 0.001;
var TEMPERATURE_COEF_OPEN_AIR = 0.04;
var TEMPERATURE_COEF_CLOSED_BALLOON = 0.01;
var SPEED_COEF = 1;
var WIND_COEF = 0.01 * SPEED_COEF;
var TEMPERATURE_TO_SPEED_COEF = 0.02 * SPEED_COEF;
var G = 0.79;

function roundFloat(float) {
    return Math.round(float * 100) / 100;
}

var Point = function(x, y) {
    this.x = x;
    this.y = y;

    this.toString = function() {
        return "(" + roundFloat(this.x, 2) + ", " + roundFloat(this.y, 2) + ")";
    }
}

var Vektor = function(x, y) {
    this.x = x;
    this.y = y;

    this.toString = function() {
        return "-> [" + roundFloat(this.x, 2) + ", " + roundFloat(this.y, 2) + "]";
    }

    this.getLenght = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    this.mulScalar = function(n) {
        this.x *= n;
        this.y *= n;
    }
}

Vektor.sum = function(vektor1, vektor2) {
    return new Vektor(vektor1.x + vektor2.x, vektor1.y + vektor2.y);
}

Vektor.sub = function(vektor1, vektor2) {
    return new Vektor(vektor1.x - vektor2.x, vektor1.y - vektor2.y);
}

var Space = function(point, size) {
    this.point = point;
    this.size = size;
}

Space.prototype.containsPoint = function(point) {
    return (
        point.x >= this.point.x && point.x <= this.point.x + this.size.width
        && point.y >= this.point.y && point.y <= this.point.y + this.size.height
    );
}

var Size = function(width, height) {
    this.width = width;
    this.height = height;
}

var Temperature = function(value) {
    this.value = value;

    this.addTemperature = function(temperature, coef) {
        if (typeof coef === 'undefined') {
            coef = TEMPERATURE_COEF;
        }
        var delta = temperature.value - this.value;
        this.value += delta * coef;
    }

    this.toString = function() {
        return roundFloat(this.value, 2) + '.';
    }
}

var GasJet = function(temperature, state, volume, maxVolume) {
    this.temperature = temperature;
    this.state = state;
    this.volume = volume;
    this.maxVolume = maxVolume;
    this.isTurnedOn = function() {
        return this.state === 1;
    }

    this.turnOn = function() {
        this.state = 1;
    }

    this.turnOff = function() {
        this.state = 0;
    }
}

var Basket = function(weight) {
    this.weight = weight;
}

var AirSpace = function(position, wind, size, temperature) {
    this.space = new Space(position, size);
    this.wind = wind;
    this.temperature = temperature;
}

// todo: add square
var BalloonHole = function() {
    var opened = false;

    this.isOpened = function() {
        return opened;
    }
    this.open = function() {
        opened = true;
    }
    this.close = function() {
        opened = false;
    }
    this.toggle = function() {
        opened = ! opened;
    }
}

var Balloon = function(volume, size, temperature) {
    this.volume = volume;
    this.size = size;
    this.temperature = temperature;
    this.hole = new BalloonHole();
    this.radius = size.width; // KOSTIL for view
}

var HotAirBalloon = function(position, balloon, basket, gasJet, speed) {
    this.position = position;
    this.balloon = balloon;
    this.basket = basket;
    this.gasJet = gasJet;
    this.speed = speed;
}
HotAirBalloon.prototype.applyWind = function(speed, wind) {
    var sub = Vektor.sub(wind, speed);
    sub.mulScalar(WIND_COEF);
    return Vektor.sum(speed, sub);
}
HotAirBalloon.prototype.applyTemperature = function(speed, temperature) {
    var resultSpeed = new Vektor(speed.x, speed.y);
    var temperatureDelta = this.balloon.temperature.value - temperature.value;
    resultSpeed.y += temperatureDelta * TEMPERATURE_TO_SPEED_COEF;
    return resultSpeed;
}
HotAirBalloon.prototype.applyGroundForce = function(speed) {
    var resultSpeed = new Vektor(speed.x, speed.y);
    resultSpeed.y -= Gv;
    return resultSpeed;
}
HotAirBalloon.prototype.move = function(vektor) {

    // apply speed
    this.position.y += (vektor.y - G) * SPEED_COEF; // popravka na G
    // lets fly only if we're not on ground
    if (this.position.y > 0) {
        this.position.x += vektor.x * SPEED_COEF;
    }

}

HotAirBalloon.prototype.checkColisions = function(bounds) {

    // check collision
    if (this.position.y <= 0) {
        this.position.y = 0;
    }
    if (this.position.y >= bounds.height) {
        this.position.y = bounds.height;
    }

    if (this.position.x <= 0) {
        this.position.x = 0;
    }
    if (this.position.x >= bounds.width) {
        this.position.x = bounds.width;
    }
}

var Map = function(size) {
    this.size = size;
    this.airSpaces = [];
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

Map.prototype.findAirSpace = function(point) {
    for (var i in this.airSpaces) {
        var airSpace = this.airSpaces[i];

        if (airSpace.space.containsPoint(point)) {
            return airSpace;
        }
    }

    throw new Error('Point ' + point.toString() + ' is out of map range');
}

var Game = function(width, height) {
    var hotAirBalloon = new HotAirBalloon(
        new Point(height / 2, 0),
        new Balloon(3000, new Size(10, 15), new Temperature(60)),
        new Basket(100),
        new GasJet(new Temperature(700), 0, 100, 100),
        new Vektor(0, 0)
    );
    var map = new Map(new Size(width, height));
    map.shuffleAirSpaces();
    var step = 0;

    this.getStep = function() {
        return step;
    }

    this.hotAirBalloon = hotAirBalloon;

    this.getLog = function() {
        var str = ['Step: ' + step];
        str.push('Temperature: ' + hotAirBalloon.balloon.temperature.toString());
        str.push('Balloon position: ' + hotAirBalloon.position.toString());
        str.push('Balloon speed: ' + hotAirBalloon.speed.toString());
        str.push('Wind: ' + map.findAirSpace(hotAirBalloon.position).wind.toString());

        if (hotAirBalloon.gasJet.isTurnedOn()) {
            str.push('GasJet is ON');
        } else {
            str.push('GasJet is OFF');
        }

        if (hotAirBalloon.balloon.hole.isOpened()) {
            str.push('Hole in balloon is OPEN');
        } else {
            str.push('Hole in balloon is CLOSE');
        }

        return str;
    }

    this.lifeCycleStep = function() {
        var vektor = new Vektor(0, 0);
        var airSpace = map.findAirSpace(hotAirBalloon.position);
        // recalc balloon temperature
        // open air
        if (hotAirBalloon.balloon.hole.isOpened()) {
            hotAirBalloon.balloon.temperature.addTemperature(airSpace.temperature, TEMPERATURE_COEF_OPEN_AIR);
        } else {
            hotAirBalloon.balloon.temperature.addTemperature(airSpace.temperature, TEMPERATURE_COEF_CLOSED_BALLOON);
        }
        // Gas jet
        if (hotAirBalloon.gasJet.isTurnedOn()) {
            hotAirBalloon.balloon.temperature.addTemperature(hotAirBalloon.gasJet.temperature, TEMPERATURE_COEF_NEAR_FLAME);
        }

        // recalc balloon moving vektor only if we're in air
        if (hotAirBalloon.position.y > 0) {
            vektor = hotAirBalloon.applyWind(vektor, airSpace.wind);
        }

        // recalc balloon speed according to balloon temperature
        vektor = hotAirBalloon.applyTemperature(vektor, airSpace.temperature);
        this.speed = vektor;

        hotAirBalloon.move(vektor);
        hotAirBalloon.checkColisions(map.size);
        step++;
    }
};

function getTestHotAirBalloon() {
    return new HotAirBalloon(
        new Point(0, 10),
        new Balloon(3000, new Size(10, 15), new Temperature(60)),
        new Basket(100),
        new GasJet(new Temperature(700), 0, 100, 100),
        new Vektor(0, 0)
    );
}

function testWind() {
    var hotAirBalloon = getTestHotAirBalloon();
    var wind = new Vektor(10, 0);
    for (var i = 0; i < 100; i++) {
        console.log(hotAirBalloon.speed);
        hotAirBalloon.applyWind(wind);
        console.log(hotAirBalloon.speed);
    }
}

function testTemerature() {
    var hotAirBalloon = getTestHotAirBalloon();
    var temperature = new Temperature(30);
    console.log(hotAirBalloon.speed);
    for (var i = 0; i < 100; i++) {
        hotAirBalloon.applyTemperature(temperature);
        console.log(hotAirBalloon.speed);
    }
}

function test() {
    var hotAirBalloon = getTestHotAirBalloon();
    var temperature = new Temperature(30);
    var wind = new Vektor(10, 0);
    console.log(hotAirBalloon.speed);
    for (var i = 0; i < 100; i++) {
        hotAirBalloon.applyWind(wind);
        hotAirBalloon.applyTemperature(temperature);
        console.log(hotAirBalloon.speed);
    }
}