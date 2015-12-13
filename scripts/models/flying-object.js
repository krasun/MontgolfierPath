var FlyingObject = function(position, speed, weight, size, temperature) {
    this.position = position;
    this.speed = speed;
    this.weight = weight;
    this.size = size;
    this.temperature = temperature;
}
// @todo: add check for air pressior on square
FlyingObject.prototype.applyWind = function(speed, wind) {
    return Vector.aimTo(speed, wind, WIND_COEF);
}
FlyingObject.prototype.applyTemperature = function(speed, temperature) {
    return Vector.aimTo(speed, this.getPullingForce(temperature), TEMPERATURE_TO_SPEED_COEF);
}
FlyingObject.prototype.getPullingForce = function(airTemperature) {
    var temperatureDelta = this.temperature.value - airTemperature.value;
    return new Vector(0, temperatureDelta);
}
FlyingObject.prototype.applyGroundForce = function(speed) {
    var resultSpeed = new Vector(speed.x, speed.y);
    resultSpeed.y -= Gv * this.weight;
    return resultSpeed;
}

FlyingObject.prototype.applyForce = function(force) {
    this.speed = Vector.aimTo(this.speed, force, 1 / INERTIA_COEF);
}
FlyingObject.prototype.move = function(vector) {
    // apply speed
    this.position.y += this.speed.y * SPEED_COEF;
    this.position.x += this.speed.x * SPEED_COEF;
}
FlyingObject.prototype.recalcTemerature = function(temperature) {
    this.temperature.addTemperature(temperature, TEMPERATURE_COEF);
};

FlyingObject.prototype.checkColisions = function(map) {
    var bounds = map.size,
        lowerPoint = new Point(this.position.x, this.position.y - this.size.height);
    if (lowerPoint.y + this.speed.y <= 0) {
        this.position.y = this.size.height;
        this.speed = new Vector(0, 0); // stop !
    }
    if (this.position.y >= bounds.height - this.size.height && this.speed.y > 0) {
        this.position.y = bounds.height - this.size.height;
        this.speed.y = 0;
    }

    if (this.position.x <= this.size.width && this.speed.x < 0) {
        this.position.x = this.size.width;
        this.speed.x = 0;
    }
    if (this.position.x >= bounds.width - this.size.width && this.speed.x > 0) {
        this.position.x = bounds.width - this.size.width;
        this.speed.x = 0;
    }

    for (var i = 0; i < map.relief.length - 1; i++) {
        var left = map.relief[i],
            right = map.relief[i + 1];
        if (left.x <= this.position.x && this.position.x <= right.x) {

            lowerPoint.x += this.speed.x;
            if (isPointBellowLine(lowerPoint, left, right)) {
                this.speed.x = 0;
            }

            lowerPoint.x = this.position.x;
            lowerPoint.y += this.speed.y;
            if (isPointBellowLine(lowerPoint, left, right)) {
                this.speed.y = 0;
            }
            break;
        }
    }
}