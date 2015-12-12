document.addEventListener('keyup', function (event) {
    switch (event.keyCode) {
        // up
        case 38:
            BalloonHole.close();

            event.preventDefault();
            break;
        // down
        case 40:
            GasJet.turnOff();

            event.preventDefault();
            break;
    }
});

document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        // up
        case 38:
            BalloonHole.open();

            event.preventDefault();
            break;
        // down
        case 40:
            GasJet.turnOn();

            event.preventDefault();
            break;
    }
});

