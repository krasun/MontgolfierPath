document.addEventListener('keyup', function (event) {
    switch (event.keyCode) {
        // up
        case 38:
            game.hotAirBalloon.gasJet.turnOff();

            event.preventDefault();
            break;
        // down
        case 40:
            game.hotAirBalloon.balloon.hole.close();

            event.preventDefault();
            break;
        // D
        case 68:
            game.debug = ! game.debug;

            event.preventDefault();
            break;
    }
});

document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        // up
        case 38:
            game.hotAirBalloon.gasJet.turnOn();

            event.preventDefault();
            break;
        // down
        case 40:
            game.hotAirBalloon.balloon.hole.open();

            event.preventDefault();
            break;

    }
});

