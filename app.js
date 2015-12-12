var TEMPERATURE_COEF_NEAR_FLAME = 0.001;
var TEMPERATURE_COEF_OPEN_AIR = 0.1;
var TEMPERATURE_COEF_CLOSED_BALLOON = 0.01;
var WIND_COEF = 0.01;
var SPEED_COEF = 0.001;
var TEMPERATURE_TO_SPEED_COEF = 0.2;
var G = 7.9;

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

var Balloon = function(volume, size, temperature) {
    this.volume = volume;
    this.size = size;
    this.temperature = temperature;
    this.holeState = 0;

    this.openHole = function() {
        this.holeState = 1;
    }
    this.closeHole = function() {
        this.holeState = 0;
    }
    this.isHoleOpened = function () {
        return this.holeState === 1;
    }
}

var HotAirBalloon = function(position, balloon, basket, gasJet, speed) {
    this.position = position;
    this.balloon = balloon;
    this.basket = basket;
    this.gasJet = gasJet;
    this.speed = speed;
}
HotAirBalloon.prototype.applyWind = function(wind) {
    var sub = Vektor.sub(wind, this.speed);
    sub.mulScalar(WIND_COEF);
    this.speed = Vektor.sum(this.speed, sub);
}
HotAirBalloon.prototype.applyTemperature = function(temperature) {
    var temperatureDelta = this.balloon.temperature.value - temperature.value;
    this.speed.y += temperatureDelta * TEMPERATURE_TO_SPEED_COEF - G;
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

var game = new (function() {
    var hotAirBalloon = new HotAirBalloon(
        new Point(0, 0),
        new Balloon(3000, new Size(10, 15), new Temperature(60)),
        new Basket(100),
        new GasJet(new Temperature(700), 0, 100, 100),
        new Vektor(0, 0)
    );
    var map = new Map(new Size(1000, 1000));
    map.shuffleAirSpaces();
    var step = 0;

    this.getStep = function() {
        return step;
    }

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

        if (hotAirBalloon.balloon.isHoleOpened()) {
            str.push('Hole in balloon is OPEN');
        } else {
            str.push('Hole in balloon is CLOSE');
        }

        return str;
    }

    this.openHole = function() {
        hotAirBalloon.balloon.openHole();
    }

    this.closeHole = function() {
        hotAirBalloon.balloon.closeHole();
    }

    this.toggleHole = function() {
        if (hotAirBalloon.balloon.isHoleOpened()) {
            hotAirBalloon.balloon.closeHole();
        } else {
            hotAirBalloon.balloon.openHole();
        }
    }

    this.turnGasJetOn = function() {
        hotAirBalloon.gasJet.turnOn();
    }

    this.turnGasJetOff = function() {
        hotAirBalloon.gasJet.turnOff();
    }

    this.lifeCycleStep = function() {
        var airSpace = map.findAirSpace(hotAirBalloon.position);
        // recalc balloon temperature
        // Gas jer
        if (hotAirBalloon.gasJet.isTurnedOn()) {
            hotAirBalloon.balloon.temperature.addTemperature(hotAirBalloon.gasJet.temperature, TEMPERATURE_COEF_NEAR_FLAME);
        }
        // open air
        if (hotAirBalloon.balloon.isHoleOpened()) {
            hotAirBalloon.balloon.temperature.addTemperature(airSpace.temperature, TEMPERATURE_COEF_OPEN_AIR);
        } else {
            hotAirBalloon.balloon.temperature.addTemperature(airSpace.temperature, TEMPERATURE_COEF_CLOSED_BALLOON);
        }
        // recalc balloon moving vektor only if we're in air
        if (hotAirBalloon.position.y > 0) {
            hotAirBalloon.applyWind(airSpace.wind);
        }

        // recalc balloon speed according to balloon temperature
        hotAirBalloon.applyTemperature(airSpace.temperature);

        // check collision
        if (hotAirBalloon.position.y + hotAirBalloon.speed.y <= 0 && hotAirBalloon.speed.y < 0) {
            hotAirBalloon.speed.y = 0;
            hotAirBalloon.position.y = 0;
        }
        if (hotAirBalloon.position.y + hotAirBalloon.speed.y >= map.size.height && hotAirBalloon.speed.y > 0) {
            hotAirBalloon.speed.y = 0;
            hotAirBalloon.position.y = map.size.height;
        }

        if (hotAirBalloon.position.x + hotAirBalloon.speed.x <= 0 && hotAirBalloon.speed.x < 0) {
            hotAirBalloon.speed.x = 0;
            hotAirBalloon.position.x = 0;
        }
        if (hotAirBalloon.position.x + hotAirBalloon.speed.x >= map.size.width && hotAirBalloon.speed.x > 0) {
            hotAirBalloon.speed.x = 0;
            hotAirBalloon.position.x = map.size.width;
        }

        // apply speed
        hotAirBalloon.position.y += hotAirBalloon.speed.y * SPEED_COEF;
        // lets fly only if we're not on ground
        if (hotAirBalloon.position.y > 0) {
            hotAirBalloon.position.x += hotAirBalloon.speed.x * SPEED_COEF;
        }
        step++;
    }
});

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
    var temperature = new Temperature(75);
    for (var i = 0; i < 100; i++) {
        console.log(hotAirBalloon.speed);
        hotAirBalloon.applyTemperature(temperature);
        console.log(hotAirBalloon.speed);
    }
}

testWind();
testTemerature();

setInterval(function() {
    var step = game.getStep();
    // if (step % 10 == 0) {
    //     game.turnGasJetOn();
    // }
    // if (step % 10 == 5) {
    //     game.turnGasJetOff();
    // }

    // if (step % 20 == 0) {
    //     game.closeHole();
    // }

    // if (step % 20 == 10) {
    //     game.openHole();
    // }

    var log = game.getLog();
    $('#log').html(log.join('<br/>'));
    game.lifeCycleStep();
}, 100);
$(document).keydown(function(e) {
    switch (e.keyCode) {
        case 38:
            game.turnGasJetOn();
            break;
        case 40:
            game.toggleHole();
            break;
    }
});
$(document).keyup(function(e) {
    switch (e.keyCode) {
        case 38:
            game.turnGasJetOff();
            break;
    }
});