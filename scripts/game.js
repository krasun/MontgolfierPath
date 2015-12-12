var Game = function(width, height) {
    var hotAirBalloon = new HotAirBalloon(
        new Point(height / 2, 0),
        new Balloon(3000, new Size(15, 15), new Temperature(60)),
        new Basket(new Size(3, 2)),
        new GasJet(new Temperature(700), 0, 100, 100),
        new Vektor(0, 0)
    );
    var map = new Map(new Size(width, height));
    map.shuffleAirSpaces();
    var step = 0;

    this.getStep = function() {
        return step;
    }

    this.hotAirBalloon = hotAirBalloon;

    this.getLog = function() {
        var str = ['Step: ' + step];
        str.push('Temperature: ' + hotAirBalloon.balloon.temperature.toString());
        str.push('Balloon position: ' + hotAirBalloon.position.toString());
        str.push('Balloon speed: ' + hotAirBalloon.speed.toString());
        str.push('Wind: ' + map.findAirSpace(hotAirBalloon.position).wind.toString());

        if (hotAirBalloon.gasJet.isTurnedOn()) {
            str.push('GasJet is ON');
        } else {
            str.push('GasJet is OFF');
        }

        if (hotAirBalloon.balloon.hole.isOpened()) {
            str.push('Hole in balloon is OPEN');
        } else {
            str.push('Hole in balloon is CLOSE');
        }

        return str;
    }

    this.lifeCycleStep = function() {
        var vektor = new Vektor(0, 0);
        var airSpace = map.findAirSpace(hotAirBalloon.position);
        // recalc balloon temperature
        // open air
        if (hotAirBalloon.balloon.hole.isOpened()) {
            hotAirBalloon.balloon.temperature.addTemperature(airSpace.temperature, TEMPERATURE_COEF_OPEN_AIR);
        } else {
            hotAirBalloon.balloon.temperature.addTemperature(airSpace.temperature, TEMPERATURE_COEF_CLOSED_BALLOON);
        }
        // Gas jet
        if (hotAirBalloon.gasJet.isTurnedOn()) {
            hotAirBalloon.balloon.temperature.addTemperature(hotAirBalloon.gasJet.temperature, TEMPERATURE_COEF_NEAR_FLAME);
        }

        // recalc balloon moving vektor only if we're in air
        if (hotAirBalloon.position.y > 0) {
            vektor = hotAirBalloon.applyWind(vektor, airSpace.wind);
        }

        // recalc balloon speed according to balloon temperature
        vektor = hotAirBalloon.applyTemperature(vektor, airSpace.temperature);
        this.speed = vektor;

        hotAirBalloon.move(vektor);
        hotAirBalloon.checkColisions(map.size);
        step++;
    }
};
