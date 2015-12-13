var HotAirBalloon = function(position, balloon, basket, gasJet, speed) {
    this.position = position;
    this.balloon = balloon;
    this.basket = basket;
    this.gasJet = gasJet;
    this.speed = speed;
}
HotAirBalloon.prototype.applyWind = function(speed, wind) {
    return Vektor.aimTo(speed, wind, WIND_COEF);
}
HotAirBalloon.prototype.applyTemperature = function(speed, temperature) {
    return Vektor.aimTo(speed, this.getPullingForce(temperature), TEMPERATURE_TO_SPEED_COEF);
}
HotAirBalloon.prototype.getPullingForce = function(airTemperature) {
    var temperatureDelta = this.balloon.temperature.value - airTemperature.value;
    return new Vektor(0, temperatureDelta);
}
HotAirBalloon.prototype.applyGroundForce = function(speed) {
    var resultSpeed = new Vektor(speed.x, speed.y);
    resultSpeed.y -= Gv;
    return resultSpeed;
}

HotAirBalloon.prototype.applyForce = function(force) {
    this.speed = Vektor.aimTo(this.speed, force, 1 / INERTIA_COEF);
}
HotAirBalloon.prototype.move = function(vektor) {
    // apply speed
    this.position.y += this.speed.y * SPEED_COEF;
    this.position.x += this.speed.x * SPEED_COEF;
}

HotAirBalloon.prototype.checkColisions = function(map) {
    var bounds = map.size,
        lowerPoint = new Point(this.position.x, this.position.y - this.getSize().height);
    if (lowerPoint.y <= 0 && this.speed.y < 0) {
        this.position.y = this.getSize().height;
        this.speed = new Vektor(0, 0); // stop
    }
    if (this.position.y >= bounds.height - this.getSize().height && this.speed.y > 0) {
        this.position.y = bounds.height - this.getSize().height;
        this.speed.y = 0;
    }

    if (this.position.x <= this.getSize().width && this.speed.x < 0) {
        this.position.x = this.getSize().width;
        this.speed.x = 0;
    }
    if (this.position.x >= bounds.width - this.getSize().width && this.speed.x > 0) {
        this.position.x = bounds.width - this.getSize().width;
        this.speed.x = 0;
    }

    for (var i = 0; i < map.relief.length - 1; i++) {
        var left = map.relief[i],
            right = map.relief[i + 1];
        if (left.x <= this.position.x && this.position.x <= right.x) {
            lowerPoint.x += this.speed.x;
            lowerPoint.y += this.speed.y;
            if (isPointBellowLine(lowerPoint, left, right)) {
                this.speed.x = 0;
                this.speed.y = 0;
            }
            break;
        }
    }
}

// @todo: coords aren't center!
HotAirBalloon.prototype.getSize = function() {
    if (this.size) {
        return this.size;
    }
    return this.size = new Size(
        this.balloon.size.width,
        this.balloon.size.height * 1.25 + this.basket.size.height
    );
}