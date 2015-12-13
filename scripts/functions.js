window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function isPointBellowLine(point, linePoint1, linePoint2) {
    var v1 = new Vektor(linePoint2.x - linePoint1.x, linePoint2.y - linePoint1.y);   // Vector 1
    var v2 = new Vektor(linePoint2.x - point.x, linePoint2.y - point.y);   // Vector 1
    var xp = v1.x * v2.y - v1.y * v2.x  // Cross product
    // console.log(xp);
    return xp > 0;
}

/**
 * @param {Context2d} context
 * @param {Point} position
 * @param {Vektor} vektor
 * @param {integer} headLength length of head in pixels
 *
 * @source http://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag
 */
function drawArrow(context, position, vektor, headLength) {
    if (typeof headLength === 'undefined') {
        headLength = 10;
    }
    var to = Vektor.sum(new Vektor(position.x, position.y), vektor);
    var angle = Math.atan2(to.y - position.y, to.x - position.x);
    context.moveTo(position.x, position.y);
    context.lineTo(to.x, to.y);
    context.lineTo(
        to.x - headLength * Math.cos(angle - Math.PI / 6),
        to.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    context.moveTo(to.x, to.y);
    context.lineTo(
        to.x - headLength * Math.cos(angle + Math.PI / 6),
        to.y - headLength * Math.sin(angle + Math.PI / 6)
    );
}