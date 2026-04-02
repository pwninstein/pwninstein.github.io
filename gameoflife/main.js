class Board {
    constructor(rows, columns) {
        this.columns = columns;
        this.rows = rows;
        /** @type {Array<Array<Tile>>} */
        this.tiles = new Array(this.rows);

        for (var y = 0; y < this.rows; y++) {
            this.tiles[y] = new Array(columns);
            for (var x = 0; x < this.columns; x++) {
                this.tiles[y][x] = new Tile(x, y);
            }
        }
    }

    clear() {
        for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.columns; x++) {
                this.tiles[y][x].isAlive = false;
                this.tiles[y][x].willBeAlive = false;
            }
        }
    }

    update() {
        for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.columns; x++) {
                var livingNeighbors = 0;
                var tile = this.tiles[y][x];

                // top-left
                if (this.tiles[y - 1]?.[x - 1]?.isAlive) livingNeighbors++;
                // top
                if (this.tiles[y - 1]?.[x].isAlive) livingNeighbors++;
                // top-right
                if (this.tiles[y - 1]?.[x + 1]?.isAlive) livingNeighbors++;
                // left
                if (this.tiles[y]?.[x - 1]?.isAlive) livingNeighbors++;
                // right
                if (this.tiles[y]?.[x + 1]?.isAlive) livingNeighbors++;
                // bottom-right
                if (this.tiles[y + 1]?.[x - 1]?.isAlive) livingNeighbors++;
                // bottom
                if (this.tiles[y + 1]?.[x].isAlive) livingNeighbors++;
                // bottom-left
                if (this.tiles[y + 1]?.[x + 1]?.isAlive) livingNeighbors++;

                tile.willBeAlive = (tile.isAlive && livingNeighbors == 2) || livingNeighbors == 3 || livingNeighbors == 3;
            }
        }

        for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.columns; x++) {
                var tile = this.tiles[y][x];
                tile.isAlive = tile.willBeAlive;
            }
        }
    }
}

class Tile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isHighlighed = false;
        this.isAlive = false;
        this.willBeAlive = false;
    }
}

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
var ctx = canvas.getContext("2d");
/** @type {HTMLInputElement} */
var runButton = document.getElementById("runButton");
var tileSize = 20;
var rows = Math.floor(canvas.height / tileSize);
var columns = Math.floor(canvas.width / tileSize);
var board = new Board(rows, columns);
var tileUnderMouse = null;
var isRunning = false;
var updateEveryXFrames = 20;
var framesSinceLastUpdate = 0;

function getTileUnderMouse(x, y) {
    var rowIndex = Math.floor(y / tileSize);
    var columnIndex = Math.floor(x / tileSize);

    return board.tiles[rowIndex]?.[columnIndex];

}

function getMousePositionOverCanvas(e) {
    var rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
    };
}

canvas.onmousemove = function (e) {
    if (isRunning) return;

    var { x, y } = getMousePositionOverCanvas(e);
    tileUnderMouse = getTileUnderMouse(x, y);
};

canvas.onclick = function (e) {
    if (isRunning) return;

    var { x, y } = getMousePositionOverCanvas(e);
    var tile = getTileUnderMouse(x, y);

    if (tile != null) {
        tile.isAlive = !tile.isAlive;
    }
};

function refresh() {
    if (++framesSinceLastUpdate > updateEveryXFrames) {
        framesSinceLastUpdate = 0;

        if (isRunning) update();
    }

    draw();

    requestAnimationFrame(refresh);
}

function update() {
    board.update();
}

function draw() {
    ctx.reset();

    ctx.save();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();

    for (var y = 0; y < board.rows; y++) {
        for (var x = 0; x < board.columns; x++) {
            var tile = board.tiles[y][x];
            var isHighlighed = !isRunning && tile == tileUnderMouse;

            ctx.save();

            ctx.fillStyle = tile.isAlive ? "green" : "lightgray";
            ctx.strokeStyle = isHighlighed ? "black" : "white";
            ctx.fillRect(tileSize * x, tileSize * y, tileSize, tileSize);
            ctx.strokeRect(tileSize * x, tileSize * y, tileSize, tileSize);

            ctx.restore();
        }
    }
}

function toggleRun() {
    isRunning = !isRunning;

    runButton.value = isRunning ? "Stop" : "Start";
}

function clearBoard() {
    board.clear();
}

refresh();
