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

Vektor.aimTo = function(vektor, toVektor, koef) {
    if (typeof koef === 'undefined') {
        koef = 0.01;
    }
    var sub = Vektor.sub(toVektor, vektor);
    sub.mulScalar(koef);
    return Vektor.sum(vektor, sub);
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

var Basket = function(size) {
    this.size = size;
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
