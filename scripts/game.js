var Game = function(width, height) {
    this.debug = false;

    this.hotAirBalloon = new HotAirBalloon(
        new Point(width / 2, 0),
        new Balloon(3000, new Size(15, 15), new Temperature(60)),
        new Basket(new Size(3, 2)),
        new GasJet(new Temperature(700), 0, 100, 100),
        new Vektor(0, 0)
    );
    this.map = new Map(new Size(width, height));
    this.map.shuffleAirSpaces();
    this.map.shuffleRelief();
    this.map.putLandingPlace(this.hotAirBalloon.position, 1000);
    var step = 0;

    this.getStep = function() {
        return step;
    }

    this.getLog = function() {
        var str = ['Step: ' + step];
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
        var force = new Vektor(0, 0);
        var airSpace = this.map.findAirSpace(this.hotAirBalloon.position);
        // recalc balloon temperature
        // open air
        if (this.hotAirBalloon.balloon.hole.isOpened()) {
            this.hotAirBalloon.balloon.temperature.addTemperature(airSpace.temperature, TEMPERATURE_COEF_OPEN_AIR);
        } else {
            this.hotAirBalloon.balloon.temperature.addTemperature(airSpace.temperature, TEMPERATURE_COEF_CLOSED_BALLOON);
        }
        // Gas jet
        if (this.hotAirBalloon.gasJet.isTurnedOn()) {
            this.hotAirBalloon.balloon.temperature.addTemperature(this.hotAirBalloon.gasJet.temperature, TEMPERATURE_COEF_NEAR_FLAME);
        }

        // recalc balloon moving vektor only if we're in air
        if (this.hotAirBalloon.position.y > 0) {
            force = this.hotAirBalloon.applyWind(force, airSpace.wind);
        }

        // recalc balloon speed according to balloon temperature
        force = this.hotAirBalloon.applyTemperature(force, airSpace.temperature);
        force = this.hotAirBalloon.applyGroundForce(force);
        this.hotAirBalloon.applyForce(force);

        this.hotAirBalloon.checkColisions(this.map);
        this.hotAirBalloon.move();
        step++;
    }
};
