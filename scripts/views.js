var BalloonView = {
    balloon: Montgolfiera.balloon,

    render: function (context) {
        context.beginPath();
        context.arc(BalloonView.balloon.centerPosition.x, BalloonView.balloon.centerPosition.y, BalloonView.balloon.radius, 0, 2 * Math.PI, false);
        context.fillStyle = '#9B0177';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = '#8C1A7E';
        context.stroke();
    }
};

var GondolaView = {
    balloon: Montgolfiera.balloon,

    render: function (context) {
        var
            balloonDistance = GondolaView.balloon.radius * 0.25, // 25% of balloon radius
            gondolaHeight = GondolaView.balloon.radius * 0.25,
            gondolaWidth = GondolaView.balloon.radius * 0.5,
            gondolaPositionX = GondolaView.balloon.centerPosition.x - gondolaWidth / 2,
            gondolaPositionY = balloonDistance + GondolaView.balloon.radius + GondolaView.balloon.centerPosition.y
        ;

        context.beginPath();
        context.rect(gondolaPositionX, gondolaPositionY, gondolaWidth, gondolaHeight);
        context.fillStyle = 'brown';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'gray';
        context.stroke();
    }
};

var GasJetView = {
    balloon: Montgolfiera.balloon,

    render: function (context) {
        var
            balloonDistance = GasJetView.balloon.radius * 0.25, // 25% of balloon radius
            gondolaHeight = GasJetView.balloon.radius * 0.25,
            gondolaWidth = GasJetView.balloon.radius * 0.5,
            gondolaPositionX = GasJetView.balloon.centerPosition.x - gondolaWidth / 2,
            gondolaPositionY = balloonDistance + GasJetView.balloon.radius + GasJetView.balloon.centerPosition.y
        ;

        var gasJetWidth = 0.25 * gondolaWidth,
            gasJetHeight = 0.5 * gondolaHeight,
            gasJetPositionX = gondolaPositionX + gondolaWidth / 2 - gasJetWidth / 2,
            gasJetPositionY = gondolaPositionY - balloonDistance * 0.75
        ;

        context.beginPath();
        context.rect(gasJetPositionX, gasJetPositionY, gasJetWidth, gasJetHeight);
        context.fillStyle = Montgolfiera.gasJet.isTurnedOn ? 'yellow' : 'gray';
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'gray';
        context.stroke();
    }
};

var BalloonHoleView = {
    balloon: Montgolfiera.balloon,

    render: function (context) {
        var
            balloonHoleRadius = BalloonHoleView.balloon.radius * 0.1,
            balloonHoleCenterPositionX = BalloonHoleView.balloon.centerPosition.x,
            balloonHoleCenterPositionY = BalloonHoleView.balloon.centerPosition.y - BalloonHoleView.balloon.radius
        ;

        if (Montgolfiera.balloonHole.isOpened) {
            context.beginPath();
            context.arc(balloonHoleCenterPositionX, balloonHoleCenterPositionY, balloonHoleRadius, 0, Math.PI, false);
            context.fillStyle = '#B359A8';
            context.fill();
        }
    }
};

var MontgolfieraView = {
    render: function (context) {
        BalloonView.render(context);
        GondolaView.render(context);
        GasJetView.render(context);
        BalloonHoleView.render(context);
    }
};

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

