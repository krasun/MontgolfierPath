var Cloud = function(position, size) {
    Cloud.superclass.constructor.apply(this, [
        position,
        new Vector(0, 0),
        0,
        size,
        new Temperature(0)
    ]);
}

extend(Cloud, FlyingObject);

Cloud.prototype.getPullingForce = function(temperature) {
    return new Vector(0, 0);
};

Cloud.prototype.applyGroundForce = function(speed) {
    return speed;
}
Cloud.prototype.applyWind = function(speed, wind) {
    var horizontalWind = wind.clone();
    horizontalWind.y = 0;
    return Cloud.superclass.applyWind.apply(this, [speed, horizontalWind]);
}
