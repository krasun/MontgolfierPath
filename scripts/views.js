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

        var gasJetWidth = 0.25 * gondolaWidth,
            gasJetHeight = 0.5 * gondolaHeight,
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

var MontgolfieraView = function(montgolfiera) {
    this.balloonView = new BalloonView(montgolfiera);
    this.balloonHoleView = new BalloonHoleView(montgolfiera);
    this.gondolaView = new GondolaView(montgolfiera);
    this.gasJetView = new GasJetView(montgolfiera);
    this.render = function (context) {
        this.balloonView.render(context);
        this.gondolaView.render(context);
        this.gasJetView.render(context);
        this.balloonHoleView.render(context);
    }
};

var MapView = function(map) {
    this.render = function(context) {
        context.beginPath(); 
        context.lineWidth="2";
        context.strokeStyle="brown"; // Green path
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
