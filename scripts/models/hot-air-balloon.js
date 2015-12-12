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
    this.position.y += vektor.y * SPEED_COEF; // popravka na G
    // lets fly only if we're not on ground
    if (this.position.y > this.getSize().height) {
        this.position.x += vektor.x * SPEED_COEF;
    }

}

HotAirBalloon.prototype.checkColisions = function(map) {
    var bounds = map.size;
    if (this.position.y <= this.getSize().height) {
        this.position.y = this.getSize().height;
    }
    if (this.position.y >= bounds.height - this.getSize().height) {
        this.position.y = bounds.height - this.getSize().height;
    }

    if (this.position.x <= this.getSize().width) {
        this.position.x = this.getSize().width;
    }
    if (this.position.x >= bounds.width - this.getSize().width) {
        this.position.x = bounds.width - this.getSize().width;
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