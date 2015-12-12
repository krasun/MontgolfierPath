var HotAirBalloon = function(position, balloon, basket, gasJet, speed) {
    this.position = position;
    this.balloon = balloon;
    this.basket = basket;
    this.gasJet = gasJet;
    this.speed = speed;
}
HotAirBalloon.prototype.applyWind = function(speed, wind) {
    return Vektor.aimTo(speed, wind);
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

HotAirBalloon.prototype.applyForce = function(force) {
    this.speed = Vektor.aimTo(this.speed, force, 0.1);
}
HotAirBalloon.prototype.move = function(vektor) {
    // apply speed
    this.position.y += this.speed.y * SPEED_COEF;
    this.position.x += this.speed.x * SPEED_COEF;
}

HotAirBalloon.prototype.checkColisions = function(map) {
    var bounds = map.size;
    if (this.position.y <= this.getSize().height && this.speed.y < 0) {
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
}

HotAirBalloon.prototype.getSize = function() {
    if (this.size) {
        return this.size;
    }
    return this.size = new Size(
        this.balloon.size.width,
        this.balloon.size.height * 1.25 + this.basket.size.height
    );
}