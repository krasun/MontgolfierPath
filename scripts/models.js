function roundFloat(float) {
    return Math.round(float * 100) / 100;
}

var Point = function(x, y) {
    this.x = x;
    this.y = y;

    this.toString = function() {
        return "(" + roundFloat(this.x, 2) + ", " + roundFloat(this.y, 2) + ")";
    }
    this.clone = function() {
        return new Point(this.x, this.y);
    }
}

var Vector = function(x, y) {
    this.x = x;
    this.y = y;

    this.toString = function() {
        return "-> [" + roundFloat(this.x, 2) + ", " + roundFloat(this.y, 2) + "]";
    }

    this.getLength = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    this.mulScalar = function(n) {
        this.x *= n;
        this.y *= n;
    }
    this.clone = function() {
        return new Vector(this.x, this.y);
    }
}

Vector.sum = function(vector1, vector2) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
}

Vector.sub = function(vector1, vector2) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
}

// @todo: it does not work as expected
Vector.aimTo = function(vector, toVector, koef) {
    if (typeof koef === 'undefined') {
        koef = 0.01;
    }
    var sub = Vector.sub(toVector, vector);
    sub.mulScalar(koef);
    return Vector.sum(vector, sub);
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
        return roundFloat(this.value, 2) + '°';
    }
}

// todo gas eating
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

var Basket = function(size, weight) {
    this.size = size;
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
