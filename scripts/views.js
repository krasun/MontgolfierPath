function preparePoint(point, context) {
    return new Point(point.x - context.cameraCenter, context.canvas.height - point.y);
}

var BalloonView = function(montgolfiera) {
    this.render = function (context) {
        var point = preparePoint(montgolfiera.position, context);
        context.beginPath();
        context.arc(point.x, point.y, montgolfiera.balloon.radius, 0, 2 * Math.PI, false);
        context.fillStyle = '#9B0177';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#8C1A7E';
        context.stroke();
    }
};

var AirBalloonView = function(balloon) {
    this.render = function (context) {
        var point = preparePoint(balloon.position, context);
        context.beginPath();
        // context.arc(point.x, point.y, balloon.radius, 0, 2 * Math.PI, false);
        context.ellipse(
            point.x,
            point.y,
            balloon.size.width / 2,
            balloon.size.height / 2,
            0,
            0,
            2 * Math.PI, false,
            false
        );
        context.fillStyle = 'gray';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#8C1A7E';
        context.stroke();
    }
};

var GondolaView = function(montgolfiera) {
    this.render = function (context) {
        var point = preparePoint(montgolfiera.position, context);
        var
            gondola = montgolfiera.basket,
            balloon = montgolfiera.balloon,
            balloonDistance = balloon.radius * 0.25, // 25% of balloon radius
            gondolaPositionX = point.x - gondola.size.width / 2,
            gondolaPositionY = balloonDistance + balloon.radius + point.y
        ;

        context.beginPath();
        context.rect(gondolaPositionX, gondolaPositionY, gondola.size.width, gondola.size.height);
        context.fillStyle = 'brown';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'gray';
        context.stroke();
    }
};

var GasJetView = function (montgolfiera) {
    this.render = function (context) {
        var point = preparePoint(montgolfiera.position, context);
        var
            balloon = montgolfiera.balloon,
            gasJet = montgolfiera.gasJet,
            balloonDistance = balloon.radius * 0.25, // 25% of balloon radius
            gondolaHeight = balloon.radius * 0.25,
            gondolaWidth = balloon.radius * 0.5,
            gondolaPositionX = point.x - gondolaWidth / 2,
            gondolaPositionY = balloonDistance + balloon.radius + point.y
        ;

        var gasJetWidth = 0.5 * gondolaWidth,
            gasJetHeight = 0.75 * gondolaHeight,
            gasJetPositionX = gondolaPositionX + gondolaWidth / 2 - gasJetWidth / 2,
            gasJetPositionY = gondolaPositionY - balloonDistance * 0.75
        ;

        context.beginPath();
        context.rect(gasJetPositionX, gasJetPositionY, gasJetWidth, gasJetHeight);
        context.fillStyle = gasJet.isTurnedOn() ? 'yellow' : 'gray';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'gray';
        context.stroke();
    }
};

var BalloonHoleView = function(montgolfiera) {
    this.render = function (context) {
        var point = preparePoint(montgolfiera.position, context);
        var
            balloon = montgolfiera.balloon,
            balloonHole = balloon.hole,
            balloonHoleRadius = balloon.radius * 0.1,
            balloonHoleCenterPositionX = point.x,
            balloonHoleCenterPositionY = point.y - balloon.radius
        ;

        if (balloonHole.isOpened) {
            context.beginPath();
            context.arc(balloonHoleCenterPositionX, balloonHoleCenterPositionY, balloonHoleRadius, 0, Math.PI, false);
            context.fillStyle = '#B359A8';
            context.fill();
        }
    }
};

var CloudView = function(cloud) {
    this.render = function(context) {
        var point = preparePoint(cloud.position, context),
            smallRadiusX = cloud.size.width / 6,
            smallRadiusY = cloud.size.height * 0.3,
            bigRadiusX = cloud.size.width / 4,
            bigRadiusY = cloud.size.height * 0.5;

        context.beginPath();
        context.fillStyle = 'white';
        context.lineWidth = 1;
        context.strokeStyle = 'blue';
        context.moveTo(point.x - cloud.size.width / 3, point.y + cloud.size.height / 2);
        context.lineTo(point.x + cloud.size.width / 3, point.y + cloud.size.height / 2);
        context.stroke();
        context.beginPath();
        context.ellipse(
            point.x - cloud.size.width / 3,
            point.y - cloud.size.height / 2 + cloud.size.height * 0.7, // weird
            smallRadiusX,
            smallRadiusY,
            0,
            Math.PI / 18, // 10
            Math.PI / 2, // 90
            true
        );
        context.stroke();
        context.beginPath();
        context.ellipse(
            point.x + cloud.size.width / 3,
            point.y - cloud.size.height / 2 + cloud.size.height * 0.7, // weird
            smallRadiusX,
            smallRadiusY,
            0,
            17 * Math.PI / 18, // 170
            Math.PI / 2, // 90
            false
        );
        context.stroke();
        context.beginPath();
        context.ellipse(
            point.x,
            point.y, // weird
            bigRadiusX,
            bigRadiusY,
            0,
            2 * Math.PI / 18, // 340
            8 * Math.PI / 9, // 160
            true
        );
        context.stroke();

    }
}

var MontgolfieraView = function(montgolfiera) {
    var balloonView = new BalloonView(montgolfiera),
        balloonHoleView = new BalloonHoleView(montgolfiera),
        gondolaView = new GondolaView(montgolfiera),
        gasJetView = new GasJetView(montgolfiera);
    this.render = function (context) {
        balloonView.render(context);
        gondolaView.render(context);
        gasJetView.render(context);
        balloonHoleView.render(context);
    }
};

var MapView = function(map) {
    this.render = function(context) {
        context.beginPath(); 
        context.lineWidth = "2";
        context.strokeStyle = "brown"; // Green path
        var point = preparePoint(new Point(0, 0), context);
        context.moveTo(point.x, point.y);
        for (var i in map.relief) {
            point = preparePoint(map.relief[i], context);
            context.lineTo(point.x, point.y);
        }
        point = preparePoint(new Point(map.width, 0), context);
        context.lineTo(point.x, point.y);
        context.stroke(); // Draw it
    }
}

var StatsView = function(game) {
    this.render = function(context) {
        var airSpace = game.map.findAirSpace(game.hotAirBalloon.position);
        context.font = "16px Consolas";
        context.fillStyle = "green";
        context.fillText("Balloon temperature: " + roundFloat(game.hotAirBalloon.balloon.temperature.value), 10, 20);
        context.fillText("Air temperature: " + airSpace.temperature.toString(), 10, 40);
        context.fillText("Wind: " + airSpace.wind.toString(), 10, 60);
        context.fillStyle = "#B359A8";
        context.fillText("Usage:", 10, 90);
        context.fillText("Hold up arrow to turn gas jet on", 20, 110);
        context.fillText("Release arrow to turn gas jet off", 20, 130);
        context.fillText("Hold down arrow to open balloon hole", 20, 150);
        context.fillText("Release down to close balloon hole", 20, 170);
        context.fillText("Press 'B' to launch test air balloon", 20, 190);
        context.fillText("Press 'D' to toggle debug information", 20, 210);
        context.fillText("Press 'Pause' button to pause game scene", 20, 230);
    }
}

var DebugView = function(game) {
    this.render = function(context) {
        if (! game.debug) {
            return;
        }
        context.font = "12px Consolas";
        var logs = game.getLog();
        for (var i in logs) {
            context.fillText(logs[i], context.canvas.width - 250, 20 + 12 * i);
        }

        for (var i in game.objects) {
            new FlyingObjectDebugView(game.objects[i]).render(context);
        }
    }
}

var FlyingObjectDebugView = function(flyingObject) {
    this.render = function(context) {
        var position = preparePoint(flyingObject.position, context);

        // wind
        context.beginPath();
        context.lineWidth = '1';
        context.strokeStyle = 'gray';
        var airSpace = game.map.findAirSpace(flyingObject.position);
        drawArrow(context, position, new Vector(airSpace.wind.x, -airSpace.wind.y));
        context.stroke();

        // temperature difference
        var temperatureForce = flyingObject.getPullingForce(airSpace.temperature);
        if (temperatureForce.getLength() > 0) {
            context.beginPath();
            context.lineWidth = '1';
            context.strokeStyle = temperatureForce.y < 0 ? 'blue' : 'red';
            temperatureForce.y *= -1;
            drawArrow(context, position, temperatureForce);
            context.stroke();
        }

        context.beginPath();
        context.lineWidth = '1';
        context.strokeStyle = 'black';
        drawArrow(context, position, new Vector(0, Gv * 20 * 100));
        context.stroke();

        var speed = new Vector(flyingObject.speed.x, flyingObject.speed.y);
        if (speed.getLength() > 0) {
            context.beginPath();
            context.lineWidth = '2';
            context.strokeStyle = 'green';
            speed.mulScalar(100);
            speed.y *= -1;
            drawArrow(context, position, speed);
            context.stroke();
        }
    }
}

var ViewRegistry = {
    views: [],
    registerView: function (view) {
        ViewRegistry.views.push(view);
    },
    render: function (context) {
        ViewRegistry.views.forEach(function (view) {
            view.render(context);
        });
    }
};
