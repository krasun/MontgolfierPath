var HotAirBalloon = function(position, balloon, basket, gasJet, speed) {
    this.balloon = balloon;
    this.basket = basket;
    this.gasJet = gasJet;
    size = new Size(
        this.balloon.size.width,
        this.balloon.size.height * 1.25 + this.basket.size.height
    );
    HotAirBalloon.superclass.constructor.apply(this, [
        position,
        speed,
        this.basket.weight,
        size,
        this.balloon.temperature
    ]);
}

extend(HotAirBalloon, FlyingObject);

HotAirBalloon.prototype.recalcTemerature = function(temperature) {
    // open air
    if (this.balloon.hole.isOpened()) {
        this.balloon.temperature.addTemperature(temperature, TEMPERATURE_COEF_OPEN_AIR);
    } else {
        this.balloon.temperature.addTemperature(temperature, TEMPERATURE_COEF_CLOSED_BALLOON);
    }
    // Gas jet
    if (this.gasJet.isTurnedOn()) {
        this.balloon.temperature.addTemperature(this.gasJet.temperature, TEMPERATURE_COEF_NEAR_FLAME);
    }
};

