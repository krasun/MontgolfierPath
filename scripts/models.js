var GasJet = {
    isTurnedOn: false,

    turnOn: function () {
        GasJet.isTurnedOn = true;
    },

    turnOff: function () {
        GasJet.isTurnedOn = false;
    }
};

var BalloonHole = {
    isOpened: false,

    open: function () {
        BalloonHole.isOpened = true;
    },

    close: function () {
        BalloonHole.isOpened = false;
    }
};

var Balloon = {
    centerPosition: {
        x: 0,
        y: 0
    },
    radius: 100
};

var Montgolfiera = {
    balloon: Balloon,
    balloonHole: BalloonHole,
    gasJet: GasJet
};
