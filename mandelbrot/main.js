class Viewport {
    constructor (centerX, centerY, worldWidth, screenWidth, screenHeight) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.worldWidth = worldWidth;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.worldHeight = worldWidth * (screenHeight / screenWidth);
    }

    #zoomStep = 0.7;
    #cursorPullFactor = 0.8;

    screenToWorldX(screenX) {
        return this.centerX + ((screenX / this.screenWidth) - 0.5) * this.worldWidth;
    }

    screenToWorldY(screenY) {
        return this.centerY - ((screenY / this.screenHeight) - 0.5) * this.worldHeight;
    }

    worldToScreenX(worldX) {
        return ((worldX - this.centerX) / this.worldWidth + 0.5) * this.screenWidth;
    }

    worldToScreenY(worldY) {
        return ((this.centerY - worldY) / this.worldHeight + 0.5) * this.screenHeight;
    }

    zoomInAt(screenX, screenY) {
        this.#zoomAt(screenX, screenY, -1);
    }

    zoomOutAt(screenX, screenY) {
        this.#zoomAt(screenX, screenY, 1);
    }

    zoomIn() {
        this.#zoom(-1);
    }

    zoomOut() {
        this.#zoom(1);
    }

    #zoomAt(screenX, screenY, direction) {
        this.centerX += (this.screenToWorldX(screenX) - this.centerX) * this.#cursorPullFactor;
        this.centerY += (this.screenToWorldY(screenY) - this.centerY) * this.#cursorPullFactor;
        
        this.#zoom(direction);
    }

    #zoom(direction) {
        this.worldWidth *= Math.exp(direction * this.#zoomStep);
        this.worldHeight = this.worldWidth * (this.screenHeight / this.screenWidth);
    }

    pan(dx, dy) {
        const worldPerPixelX = this.worldWidth / this.screenWidth;
        const worldPerPixelY = this.worldHeight / this.screenHeight;

        this.centerX -= dx * worldPerPixelX;
        this.centerY += dy * worldPerPixelY;
    }

    reset(centerX, centerY, worldWidth) {
        this.worldWidth = worldWidth
        this.worldHeight = this.worldWidth * (this.screenHeight / this.screenWidth);
        this.centerX = centerX;
        this.centerY = centerY;
    }
}

/** @type {number} **/
var iterations;
/** @type {CanvasRenderingContext2D} **/
var ctx;
/** @type {ImageData} **/
var imageData;
/** @type {Uint32Array} **/
var pixels;
/** @type {HTMLCanvasElement} **/
var canvas = document.getElementById("canvas");
/** @type {HTMLInputElement} **/
var iterationsInput = document.getElementById("iterationsInput");
var viewport = new Viewport(-0.75, 0, 3.5, canvas.width, canvas.height);

canvas.addEventListener("wheel", onCanvasWheel);
canvas.addEventListener("click", onCanvasLeftClick);
canvas.addEventListener("contextmenu", onCanvasRightClick);
ctx = canvas.getContext("2d");

imageData = ctx.createImageData(canvas.width, canvas.height);
pixels = new Uint32Array(imageData.data.buffer);

iterations = +iterationsInput.value;

/** @type {Array<number>} **/
var palette;

buildPalette();

calculateAndDraw();

function resetViewport() {
    viewport.reset(-0.75, 0, 3.5);
    calculateAndDraw();
}

function changeIterationsBy(value) {
    setIterations(iterations + (+value));
}

function setIterations(value) {
    iterations = Math.max(1, +value);
    iterationsInput.value = iterations.toString();
    buildPalette();
    calculateAndDraw();
}

function buildPalette() {
    palette = new Array(iterations);

    for (var x = 0; x < palette.length; x++) {
        var rgb = hslToRgb(x / iterations, 1, 0.5);

        palette[x] = (255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0];
    }
}

function getCanvasMousePosition(event) {
    var rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    var x = (event.clientX - rect.left) * scaleX;
    var y = (event.clientY - rect.top) * scaleY;    

    return { x, y };
}

/** @param {WheelEvent} event **/
function onCanvasWheel(event) {
    event.preventDefault();
    
    if (event.deltaY < 0) {
        const { x, y } = getCanvasMousePosition(event);
        viewport.zoomInAt(x, y);
    } else {
        viewport.zoomOut();
    }
    
    calculateAndDraw();
}

/** @param {PointerEvent} event **/
function onCanvasLeftClick(event) {
    event.preventDefault();
    const { x, y } = getCanvasMousePosition(event);
    viewport.zoomInAt(x, y);
    calculateAndDraw();
}

/** @param {PointerEvent} event **/
function onCanvasRightClick(event) {
    event.preventDefault();
    viewport.zoomOut();
    calculateAndDraw();
}

function calculateAndDraw() {
    console.time("calculateAndDraw");

    var worldMinX = viewport.centerX - viewport.worldWidth / 2;
    var worldMaxY = viewport.centerY + viewport.worldHeight / 2;
    var dx = viewport.worldWidth / canvas.width;
    var dy = viewport.worldHeight / canvas.height;

    for (var y = 0; y < canvas.height; y++) {
        var i = worldMaxY - y * dy;
        var r = worldMinX;
        for (var x = 0; x < canvas.width; x++) {
            var zr = 0;
            var zi = 0;
            var escapeIteration = null;

            for (var iterationNumber = 0; iterationNumber < iterations; iterationNumber++) {
                var zrtemp = zr * zr - zi * zi;
                var zitemp = 2 * zr * zi;
                
                zr = zrtemp + r;
                zi = zitemp + i;

                var absoluteValueSquared = zr * zr + zi * zi;

                if (absoluteValueSquared >= 4) {
                    escapeIteration = iterationNumber;
                    break;
                }
            }

            var pixel = escapeIteration != null ? palette[escapeIteration] : 255 << 24;
            pixels[x + y * canvas.width] = pixel;

            r += dx;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    console.timeEnd("calculateAndDraw");
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
