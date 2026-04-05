/** @type {HTMLInputElement} */
var inputTextArea = document.getElementById("inputTextArea");
/** @type {HTMLTextAreaElement} */
var outputTextArea = document.getElementById("outputTextArea");
/** @type {HTMLSelectElement} */
var algorithmSelect = document.getElementById("algorithmSelect");
var encoder = new TextEncoder();

class Algorithm {
    constructor(name, fn) {
        this.name = name;
        this.fn = fn;
    }
}

function md5(str) {
    const encoder = new TextEncoder();
    const input = encoder.encode(str);

    function rotateLeft(x, c) {
        return (x << c) | (x >>> (32 - c));
    }

    function toHex(num) {
        let s = "";
        for (let i = 0; i < 4; i++) {
            s += ("0" + ((num >>> (i * 8)) & 0xff).toString(16)).slice(-2);
        }
        return s.toUpperCase();
    }

    const K = new Uint32Array(64);
    for (let i = 0; i < 64; i++) {
        K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0;
    }

    const s = new Uint8Array([
        7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16,
        23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
    ]);

    const paddedLength = ((input.length + 9 + 63) >> 6) << 6;
    const msg = new Uint8Array(paddedLength);
    msg.set(input);
    msg[input.length] = 0x80;

    const bitLength = input.length * 8;
    const bitLengthLo = bitLength >>> 0;
    const bitLengthHi = Math.floor(bitLength / 0x100000000) >>> 0;

    msg[paddedLength - 8] = bitLengthLo & 0xff;
    msg[paddedLength - 7] = (bitLengthLo >>> 8) & 0xff;
    msg[paddedLength - 6] = (bitLengthLo >>> 16) & 0xff;
    msg[paddedLength - 5] = (bitLengthLo >>> 24) & 0xff;
    msg[paddedLength - 4] = bitLengthHi & 0xff;
    msg[paddedLength - 3] = (bitLengthHi >>> 8) & 0xff;
    msg[paddedLength - 2] = (bitLengthHi >>> 16) & 0xff;
    msg[paddedLength - 1] = (bitLengthHi >>> 24) & 0xff;

    let a0 = 0x67452301;
    let b0 = 0xefcdab89;
    let c0 = 0x98badcfe;
    let d0 = 0x10325476;

    for (let i = 0; i < paddedLength; i += 64) {
        const M = new Uint32Array(16);

        for (let j = 0; j < 16; j++) {
            const offset = i + j * 4;
            M[j] = msg[offset] | (msg[offset + 1] << 8) | (msg[offset + 2] << 16) | (msg[offset + 3] << 24);
        }

        let A = a0;
        let B = b0;
        let C = c0;
        let D = d0;

        for (let j = 0; j < 64; j++) {
            let F, g;

            if (j < 16) {
                F = (B & C) | (~B & D);
                g = j;
            } else if (j < 32) {
                F = (D & B) | (~D & C);
                g = (5 * j + 1) & 15;
            } else if (j < 48) {
                F = B ^ C ^ D;
                g = (3 * j + 5) & 15;
            } else {
                F = C ^ (B | ~D);
                g = (7 * j) & 15;
            }

            const temp = D;
            D = C;
            C = B;
            B = (B + rotateLeft((A + F + K[j] + M[g]) | 0, s[j])) | 0;
            A = temp;
        }

        a0 = (a0 + A) | 0;
        b0 = (b0 + B) | 0;
        c0 = (c0 + C) | 0;
        d0 = (d0 + D) | 0;
    }

    return "0x" + toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

function reflectBits(value, width) {
    let result = 0;

    for (let i = 0; i < width; i++) {
        result = (result << 1) | (value & 1);
        value >>>= 1;
    }

    return result >>> 0;
}

function makeCrcTable({ width, polynomial, refin }) {
    const table = new Array(256);
    const topBit = width === 32 ? 0x80000000 : 1 << (width - 1);
    const mask = width === 32 ? 0xffffffff : (1 << width) - 1;

    for (let i = 0; i < 256; i++) {
        let crc;

        if (refin) {
            crc = i;

            for (let j = 0; j < 8; j++) {
                if ((crc & 1) !== 0) {
                    crc = (crc >>> 1) ^ polynomial;
                } else {
                    crc >>>= 1;
                }
            }
        } else {
            crc = i << (width - 8);

            for (let j = 0; j < 8; j++) {
                if ((crc & topBit) !== 0) {
                    crc = ((crc << 1) ^ polynomial) & mask;
                } else {
                    crc = (crc << 1) & mask;
                }
            }
        }

        table[i] = crc >>> 0;
    }

    return table;
}

function createCrc(config) {
    const { width, polynomial, init, refin, refout, xorout } = config;

    if (width < 1 || width > 32) {
        throw new Error("This implementation supports CRC widths from 1 to 32 bits.");
    }

    const actualPolynomial = refin ? reflectBits(polynomial, width) : polynomial;
    const mask = width === 32 ? 0xffffffff : (1 << width) - 1;
    const table = makeCrcTable({ width, polynomial: actualPolynomial, refin });
    const encoder = new TextEncoder();

    function compute(input) {
        const bytes = typeof input === "string" ? encoder.encode(input) : input;
        let crc = init >>> 0;

        if (refin) {
            for (let i = 0; i < bytes.length; i++) {
                crc = (table[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8)) >>> 0;
            }
        } else {
            const shift = width - 8;

            for (let i = 0; i < bytes.length; i++) {
                crc = (table[((crc >>> shift) ^ bytes[i]) & 0xff] ^ ((crc << 8) & mask)) >>> 0;
            }
        }

        if (refout !== refin) {
            crc = reflectBits(crc, width);
        }

        crc = (crc ^ xorout) & mask;

        return crc >>> 0;
    }

    function computeHex(input) {
        const value = compute(input);
        const hexLength = Math.ceil(width / 4);
        return "0x" + value.toString(16).padStart(hexLength, "0").toUpperCase();
    }

    return computeHex;
}

const crc8 = createCrc({
    width: 8,
    polynomial: 0x07,
    init: 0x00,
    refin: false,
    refout: false,
    xorout: 0x00,
});

const crc16 = createCrc({
    width: 16,
    polynomial: 0x8005,
    init: 0x0000,
    refin: true,
    refout: true,
    xorout: 0x0000,
});

const crc32 = createCrc({
    width: 32,
    polynomial: 0x04c11db7,
    init: 0xffffffff,
    refin: true,
    refout: true,
    xorout: 0xffffffff,
});

async function hash(identifier, text) {
    const msgBuffer = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(identifier, msgBuffer);
    return "0x" + new Uint8Array(hashBuffer).toHex().toUpperCase();
}

const sha1 = (text) => hash("SHA-1", text);
const sha256 = (text) => hash("SHA-256", text);
const sha384 = (text) => hash("SHA-384", text);
const sha512 = (text) => hash("SHA-512", text);

/** @type {Array<Algorithm>} */
var algorithms = [
    new Algorithm("MD5", md5),
    new Algorithm("CRC-8", crc8),
    new Algorithm("CRC-16", crc16),
    new Algorithm("CRC-32", crc32),
    new Algorithm("SHA-1", sha1),
    new Algorithm("SHA-256", sha256),
    new Algorithm("SHA-384", sha384),
    new Algorithm("SHA-512", sha512),
    new Algorithm("Base-64 Encode", window.btoa),
    new Algorithm("Base-64 Decode", window.atob),
    new Algorithm("URL Encode", window.encodeURI),
    new Algorithm("URL Decode", window.decodeURI),
    new Algorithm("URL Component Encode", window.encodeURIComponent),
    new Algorithm("URL Component Decode", window.decodeURIComponent),
];

algorithms.forEach((a, i) => {
    algorithmSelect.add(new Option(a.name, i, i === 0));
});

/** @type {(text: string) => Promise<string>} */
let algorithm = null;
function setAlgorithm(index) {
    algorithm = algorithms[index].fn;
    run();
}

setAlgorithm(algorithmSelect.value);

async function run() {
    const sourceText = inputTextArea.value;

    if (sourceText == null) {
        outputTextArea.value = "";
        return;
    }

    try {
        outputTextArea.value = await algorithm(sourceText);
    } catch (e) {
        outputTextArea.value = e;
    }
}
