var AirBalloon = function(position, speed, weight, size, temperature, airDensity) {
    this.airDensity = airDensity;
    AirBalloon.superclass.constructor.apply(this, [
        position,
        speed,
        weight,
        size,
        temperature
    ]);
}

extend(AirBalloon, FlyingObject);

AirBalloon.prototype.getPullingForce = function(temperature) {
    var force = AirBalloon.superclass.getPullingForce.apply(this, arguments);

    force.y += (DENSITY_AIR - this.airDensity) * TEMPERATURE_DENSITY_DEPENDENCY;

    return force;
};

