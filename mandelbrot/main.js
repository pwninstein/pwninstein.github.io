var canvasWidth, canvasHeight, canvas;
var xmin, xmax, ymin, ymax, iterations, showbox = true;
/** @type {CanvasRenderingContext2D} */
var context, imageData, pixels;

document.addEventListener('DOMContentLoaded', function () {

    var canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', function (e) { Zoom(canvas, e); });
    canvas.addEventListener('mousemove', function (e) { DrawBox(canvas, e); });
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    context = canvas.getContext("2d");

    imageData = context.createImageData(canvas.width, canvas.height);
    pixels = new Uint32Array(imageData.data.buffer);

    document.getElementById('go-button').onclick = function(event) {
        event.preventDefault();        
        Go();
    };

    document.getElementById('reset-button').onclick = function(){
        SetRange(-2, 2, -2, 2);
        SetIterations(50);
        Go();
    }

    document.getElementById('showbox').addEventListener( 'change', function() {
        showbox = this.checked;
        DrawImageData();
    });

    Go();
});

function Go(){
    UpdateParams();
    RecalculateAndRedraw();
}

function UpdateParams(){
    xmin = +(document.getElementById('xmin').value);
    xmax = +(document.getElementById('xmax').value);
    ymin = +(document.getElementById('ymin').value);
    ymax = +(document.getElementById('ymax').value);
    iterations = +(document.getElementById('iterations').value);
}

function RecalculateAndRedraw(){
    CalculateVelocities();
    CalculateImageData();
    DrawImageData();
}

function SetRange(xmin2, xmax2, ymin2, ymax2){
    document.getElementById('xmin').value = xmin = xmin2;
    document.getElementById('xmax').value = xmax = xmax2
    document.getElementById('ymin').value = ymin = ymin2;
    document.getElementById('ymax').value = ymax = ymax2;
}

function SetIterations(iterations){
    document.getElementById('iterations').value =  iterations;
}

var isZooming = false;
var animationFrames = 30;
var currentFrame = 0;
var newImage;
var zInitLeft, zInitTop, zInitRight, zInitBottom;

function Zoom(canvas, event) {
    UpdateParams();

    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    SetRange(
        GetR(x - (canvasWidth / 8)), 
        GetR(x + (canvasWidth / 8)), 
        GetI(y - (canvasHeight / 8)), 
        GetI(y + (canvasHeight / 8)));

    isZooming = true;
    currentFrame = 0;
    zInitLeft = (x - (canvasWidth / 8));
    zInitTop = (y - (canvasHeight / 8));
    zInitRight = (x + (canvasWidth / 8));
    zInitBottom = (y + (canvasHeight / 8));
    createImageBitmap(imageData).then(function(response){
        newImage = response;
        window.requestAnimationFrame(AnimateZoom);
    });
}

function AnimateZoom(timestamp){
    currentFrame++;
    var factor = currentFrame / animationFrames;
    
    // context.drawImage(newImage, 
    //     zInitLeft, 
    //     zInitTop, 
    //     zInitRight - zInitLeft, 
    //     zInitBottom - zInitTop, 
    //     zInitLeft - zInitLeft * factor,
    //     zInitTop - zInitTop * factor, 
    //     (zInitRight - zInitLeft) + (canvasWidth - (zInitRight - zInitLeft)) * factor, 
    //     (zInitBottom - zInitTop) + (canvasHeight - (zInitBottom - zInitTop)) * factor);
    
    
    context.drawImage(newImage, 
        -zInitLeft * 4 * factor,
        -zInitTop * 4 * factor, 
        canvasWidth + ((canvasWidth * 4 - canvasWidth) * factor), 
        canvasHeight + ((canvasHeight * 4 - canvasHeight) * factor));

    if(currentFrame < animationFrames){
        window.requestAnimationFrame(AnimateZoom);
    }else{
        isZooming = false;
        RecalculateAndRedraw();
    }
}

function DrawBox(canvas, event) {
    if(!showbox || isZooming) return;
    
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    context.putImageData(imageData, 0, 0);

    context.fillStyle = 'rgba(128,128,128,0.3)';
    context.fillRect(x - canvasWidth / 8, y - canvasHeight / 8, canvasHeight / 4, canvasHeight / 4);
}

/** @type {Array.<Array.<number>>} */
var velocities

function CalculateVelocities() {
    var startTime = new Date();

    velocities = new Array(canvasHeight);

    for (var i = 0; i < velocities.length; i++) {
        velocities[i] = new Array(canvasWidth);
    }

    for (var x = 0; x < canvasWidth; x++) {
        var r = GetR(x);

        for (var y = 0; y < canvasHeight; y++) {
            var i = GetI(y), zr = 0, zi = 0, velocity = 0, absoluteValueSquared = 0;

            for (var iterationNumber = 0; iterationNumber < iterations; iterationNumber++) {
                var zrtemp = zr * zr - zi * zi, zitemp = zr * zi + zi * zr;

                zr = zrtemp + r;
                zi = zitemp + i;

                absoluteValueSquared = zr * zr + zi * zi;

                if (absoluteValueSquared >= 4) {
                    velocity = iterationNumber;
                    break;
                };
            }

            velocities[y][x] = absoluteValueSquared >= 4 ? velocity : null;
        }
    }

    console.log("CalculateVelocities took " + (new Date().getTime() - startTime.getTime()) + " ms");
}

function CalculateImageData() {
    var startTime = new Date();

    context.clearRect(0, 0, canvasWidth, canvasHeight);

    for (var y = 0; y < velocities.length; y++) {
        for (var x = 0; x < velocities[y].length; x++) {

            var pixel = 255 << 24;

            if (velocities[y][x] != null) {
                var rgb = hslToRgb(velocities[y][x] / iterations, 1, 0.5);

                pixel = 255 << 24 | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0];
            }

            pixels[x + y * canvasWidth] = pixel;
        }
    }

    console.log("CalculateImageData took " + (new Date().getTime() - startTime.getTime()) + " ms");
}

function DrawImageData(){
    context.putImageData(imageData, 0, 0);
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
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function GetR(x) {
    return xmin + (((xmax - xmin) / canvasWidth * x));
}

function GetI(y) {
    return (-(ymin + (((ymax - ymin) / canvasHeight * y))));
}
