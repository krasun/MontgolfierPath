var MontgolfieraGasJet = {
    isTurnedOn: false,

    turnOn: function () {
        MontgolfieraGasJet.isTurnedOn = true;
    },

    turnOff: function () {
        MontgolfieraGasJet.isTurnedOn = false;
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

var MontgolfieraBalloon = {
    centerPosition: {
        x: 0,
        y: 0
    },
    radius: 100
};

var Montgolfiera = {
    balloon: MontgolfieraBalloon,
    balloonHole: BalloonHole,
    gasJet: MontgolfieraGasJet
};
