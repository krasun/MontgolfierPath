var Game = function(width, height) {
    this.debug = false;

    this.hotAirBalloon = new HotAirBalloon(
        new Point(width / 2, 15 * 1.25 + 2),
        new Balloon(3000, new Size(15, 15), new Temperature(60)),
        new Basket(new Size(3, 2), 100),
        new GasJet(new Temperature(700), 0, 100, 100),
        new Vector(0, 0)
    );
    this.hotAirBalloon.position = new Point(width / 2, this.hotAirBalloon.size.height);
    this.map = new Map(new Size(width, height));
    this.map.shuffleAirSpaces();
    this.map.shuffleRelief();
    this.map.putLandingPlace(this.hotAirBalloon.position, 1000);
    var step = 0;

    this.objects = [this.hotAirBalloon];

    this.getStep = function() {
        return step;
    }

    this.getLog = function() {
        var str = ['Frame: ' + step];
        str.push('Objects: ' + this.objects.length);
        str.push('Temperature: ' + this.hotAirBalloon.balloon.temperature.toString());
        str.push('Balloon position: ' + this.hotAirBalloon.position.toString());
        str.push('Balloon speed: ' + this.hotAirBalloon.speed.toString());
        str.push('Wind: ' + this.map.findAirSpace(this.hotAirBalloon.position).wind.toString());

        if (this.hotAirBalloon.gasJet.isTurnedOn()) {
            str.push('GasJet is ON');
        } else {
            str.push('GasJet is OFF');
        }

        if (this.hotAirBalloon.balloon.hole.isOpened()) {
            str.push('Hole in balloon is OPEN');
        } else {
            str.push('Hole in balloon is CLOSE');
        }

        return str;
    }

    this.lifeCycleStep = function() {
        for (var i in this.objects) {
            var object = this.objects[i];
            if (! (object instanceof FlyingObject)) {
                continue;
            }

            var force = new Vector(0, 0);
            var airSpace = this.map.findAirSpace(object.position);
            // recalc balloon temperature
            object.recalcTemerature(airSpace.temperature);
            // console.log(object, object.recalcTemerature);

            force = object.applyWind(force, airSpace.wind);
            force = object.applyTemperature(force, airSpace.temperature);
            force = object.applyGroundForce(force);
            object.applyForce(force);

            object.checkColisions(this.map);
            object.move();
        }
        step++;
    }

    this.addAirBalloon = function() {
        var balloon = new AirBalloon(
            this.hotAirBalloon.position.clone(),
            new Vector(0, 0),
            0.5,
            new Size(1, 1),
            new Temperature(20),
            DENSITY_HELIUM
        );
        this.objects.push(balloon);

        return balloon;
    }
};
