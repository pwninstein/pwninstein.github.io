/** @param {number} index1, @param {number} index2  */
function compare(index1, index2) {
    return { index1, index2, type: "compare" };
}

/** @param {Array<number>} values, @param {number} index1, @param {number} index2 */
function swap(values, index1, index2) {
    [values[index1], values[index2]] = [values[index2], values[index1]];
    return { index1, index2, type: "swap" };
}

/** @param {Array<number>} values */
function* bubbleSort(values) {
    let didSwap = false;
    let maxIndex = values.length;

    do {
        didSwap = false;
        maxIndex--;

        for (let index = 0; index < maxIndex; index++) {
            // yield compare(index, index + 1);
            if (values[index] > values[index + 1]) {
                yield swap(values, index, index + 1);
                didSwap = true;
            }
        }
    } while (didSwap);
}
/** @param {Array<number>} values */
function* selectionSort(values) {
    for (let targetIndex = 0; targetIndex < values.length - 1; targetIndex++) {
        let minIndex = targetIndex;

        for (let index = targetIndex + 1; index < values.length; index++) {
            // yield compare(index, minIndex);
            if (values[index] < values[minIndex]) {
                minIndex = index;
            }
        }

        if (minIndex == targetIndex) {
            continue;
        }

        yield swap(values, targetIndex, minIndex);
    }
}

/** @param {Array<number>} values */
function* insertionSort(values) {
    for (let unsortedIndex = 0; unsortedIndex < values.length; unsortedIndex++) {
        for (let sortedIndex = unsortedIndex; sortedIndex >= 0; sortedIndex--) {
            //yield compare(sortedIndex - 1, sortedIndex);
            if (values[sortedIndex - 1] > values[sortedIndex]) {
                yield swap(values, sortedIndex - 1, sortedIndex);
            } else {
                break;
            }
        }
    }
}

/** @param {Array<number>} values */
function* gnomeSort(values) {
    let index = 1;
    while (index < values.length) {
        // yield compare(index, index - 1);
        if (values[index - 1] > values[index]) {
            yield swap(values, index, index - 1);
            index--;
        } else {
            index++;
        }
    }
}

/** @param {Array<number>} values */
function* shakerSort(values) {
    let endIndex = values.length - 1;
    let startIndex = 0;
    let swapped = true;

    while (swapped) {
        swapped = false;

        for (let index = startIndex; index < endIndex; index++) {
            // yield compare(index, index + 1);
            if (values[index] > values[index + 1]) {
                yield swap(values, index, index + 1);
                swapped = true;
            }
        }

        if (!swapped) {
            break;
        }

        endIndex--;

        for (let index = endIndex; index > startIndex; index--) {
            // yield compare(index, index - 1);
            if (values[index - 1] > values[index]) {
                yield swap(values, index, index - 1);
                swapped = true;
            }
        }

        startIndex++;
    }
}

/** @param {Array<number>} values */
function* oddEvenSort(values) {
    let swapped = true;

    while (swapped) {
        swapped = false;

        for (let index = 1; index < values.length - 1; index += 2) {
            if (values[index] > values[index + 1]) {
                yield swap(values, index, index + 1);

                swapped = true;
            }
        }

        for (let index = 0; index < values.length - 1; index += 2) {
            if (values[index] > values[index + 1]) {
                yield swap(values, index, index + 1);

                swapped = true;
            }
        }
    }
}

/** @param {Array<number>} values, @param {number} maxIndex */
function* flip(values, maxIndex) {
    let startIndex = 0;
    let endIndex = maxIndex;

    while (startIndex < endIndex) {
        yield swap(values, startIndex, endIndex);

        startIndex++;
        endIndex--;
    }
}

/** @param {Array<number>} values */
function* pancakeSort(values) {
    let unsortedSize = values.length;
    while (unsortedSize > 0) {
        let maxIndex = 0;
        for (let index = 0; index < unsortedSize; index++) {
            if (values[index] > values[maxIndex]) {
                maxIndex = index;
            }
        }

        if (maxIndex !== unsortedSize - 1) {
            yield* flip(values, maxIndex);
            yield* flip(values, unsortedSize - 1);
        }

        unsortedSize--;
    }
}

/** @param {Array<number>} values, @param {number} startIndex, @param {number} endIndex */
function* partition(values, startIndex, endIndex) {
    if (startIndex >= endIndex) {
        return;
    }

    const pivot = values[endIndex];
    let leftIndex = startIndex;
    let rightIndex = endIndex - 1;

    while (leftIndex <= rightIndex) {
        while (leftIndex <= endIndex && values[leftIndex] < pivot) {
            leftIndex++;
        }

        while (rightIndex >= startIndex && values[rightIndex] >= pivot) {
            rightIndex--;
        }

        if (leftIndex < rightIndex) {
            yield swap(values, rightIndex, leftIndex);
        } else {
            yield swap(values, endIndex, leftIndex);
        }
    }

    yield* partition(values, startIndex, leftIndex - 1);
    yield* partition(values, leftIndex + 1, endIndex);
}

/** @param {Array<number>} values */
function* quickSort(values) {
    yield* partition(values, 0, values.length - 1);
}

var algorithms = {
    bubbleSort,
    selectionSort,
    insertionSort,
    gnomeSort,
    shakerSort,
    oddEvenSort,
    pancakeSort,
    quickSort,
};

/** @type {HTMLCanvasElement} **/
var canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
/** @type {Array<number>} **/
var values = [];
var maxValue = 0;
/** @type {HTMLSelectElement} **/
var selectedAlgorithmInput = document.getElementById("selectedAlgorithmInput");
/** @type {HTMLSelectElement} **/
var elementCountInput = document.getElementById("elementCountInput");
/** @type {HTMLSelectElement} **/
var swapDelayInput = document.getElementById("swapDelayInput");
/** @type {HTMLButtonElement} **/
var shuffleButton = document.getElementById("shuffleButton");
/** @type {HTMLButtonElement} **/
var goButton = document.getElementById("goButton");
/** @type {HTMLButtonElement} **/
var pauseResumeButton = document.getElementById("pauseResumeButton");
/** @type {HTMLButtonElement} **/
var cancelButton = document.getElementById("cancelButton");
/** @type {number} **/
var swapDelay = undefined;
var selectedAlgorithm = undefined;
var generator = undefined;
/** @type {number} **/
let compareIndex1 = undefined;
/** @type {number} **/
let compareIndex2 = undefined;
/** @type {number} **/
let swapIndex1 = undefined;
/** @type {number} **/
let swapIndex2 = undefined;
let state = "completed";

function drawValues() {
    ctx.reset();

    const scale = canvas.height / maxValue;
    const barWidth = canvas.width / values.length;

    for (let index = 0; index < values.length; index++) {
        const value = values[index];
        const barHeight = value * scale;
        const x = index * barWidth;
        const y = canvas.height - barHeight;

        const isComparing = index === compareIndex1 || index === compareIndex2;
        const isSwapping = index === swapIndex1 || index === swapIndex2;

        ctx.fillStyle = isComparing ? "green" : isSwapping ? "blue" : "white";
        ctx.fillRect(x, y, barWidth, barHeight);

        ctx.strokeStyle = "black";
        ctx.strokeRect(x, y, barWidth, barHeight);
    }

    [compareIndex1, compareIndex2, swapIndex1, swapIndex2] = [undefined, undefined, undefined, undefined];
}

/** @param {string} algorithm */
function setAlgorithm(algorithm) {
    selectedAlgorithm = algorithms[algorithm];
}

/** @param {number} value */
function setElementCount(value) {
    values = [];

    for (let x = 1; x < value; x++) {
        values.push(x);
    }

    maxValue = Math.max(...values);

    shuffle();
    drawValues();
}

/** @param {number} value */
function setSwapDelay(value) {
    swapDelay = value;
}

function shuffle() {
    values.sort(() => Math.random() - 0.5);
    drawValues();
}

/** @param {"completed" | "paused" | "running"} newState */
function setState(newState) {
    state = newState;

    if (state === "completed") {
        selectedAlgorithmInput.disabled = false;
        elementCountInput.disabled = false;
        swapDelayInput.disabled = false;
        shuffleButton.disabled = false;
        goButton.disabled = false;
        cancelButton.disabled = true;
        pauseResumeButton.disabled = true;
    } else if (state === "running") {
        selectedAlgorithmInput.disabled = true;
        elementCountInput.disabled = true;
        swapDelayInput.disabled = true;
        shuffleButton.disabled = true;
        goButton.disabled = true;
        pauseResumeButton.disabled = false;
        pauseResumeButton.innerText = "Pause";
        cancelButton.disabled = false;

        iterateAndDraw();
    } else if (state === "paused") {
        selectedAlgorithmInput.disabled = true;
        elementCountInput.disabled = true;
        swapDelayInput.disabled = true;
        shuffleButton.disabled = true;
        goButton.disabled = true;
        cancelButton.disabled = false;
        pauseResumeButton.disabled = false;
        pauseResumeButton.innerText = "Resume";
    }
}

function startSorting() {
    generator = selectedAlgorithm(values);

    setState("running");

    iterateAndDraw();
}

function pauseResume() {
    if (state === "paused") {
        setState("running");
    } else if (state === "running") {
        setState("paused");
    }
}

function cancel() {
    setState("completed");
}

function iterateAndDraw() {
    if (state !== "running") {
        return;
    }

    const next = generator.next();

    if (!next.done) {
        const op = next.value;
        if (op.type === "compare") {
            [compareIndex1, compareIndex2] = [op.index1, op.index2];
        } else if (op.type === "swap") {
            // console.log('swapping', values[op.index1], values[op.index2]);
            [swapIndex1, swapIndex2] = [op.index1, op.index2];
        }

        drawValues();

        setTimeout(iterateAndDraw, swapDelay);
    } else {
        drawValues();
        setState("completed");
    }
}

setAlgorithm(selectedAlgorithmInput.value);
setElementCount(+elementCountInput.value);
setSwapDelay(+swapDelayInput.value);
setState("completed");