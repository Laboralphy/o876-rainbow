/**
 *
 * @typedef ColorNumber {number}
 *
 * @typedef ColorType {ColorNumber|string}
 *
 *
 */

import htmlColorCodes from './html-color-codes.json' with { type: 'json' };

const REGEXP_SHTML3 = /^#([a-f0-9])([a-f0-9])([a-f0-9])$/
const REGEXP_SHTML6 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/
const REGEXP_RGB = /^rgb\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/
const REGEXP_HSL = /^hsl\(\s*(\d+(?:\.\d+)?)(deg|rad|)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*\)$/

/**
 * Transforms a string (representing a color hex triplet) into a number RRGGBB
 * @param sInput {ColorType}
 * @return {ColorNumber}
 */
function parseHexString(sInput) {
    let x
    x = sInput.match(REGEXP_SHTML6)
    if (x) {
        const [, r, g, b] = x
        return parseInt(r, 16) << 16 |
            (parseInt(g, 16) << 8) |
            (parseInt(b, 16))

    }
    x = sInput.match(REGEXP_SHTML3)
    if (x) {
        const [, r, g, b] = x
        return parseInt(r + r, 16) << 16 |
            (parseInt(g + g, 16) << 8) |
            (parseInt(b + b, 16))
    }
    throw new Error('Could not parse HEX triplet string : ' + sInput)
}

function parseRGBString(sInput) {
    const x = sInput.match(REGEXP_RGB)
    if (x) {
        const [, r, g, b] = x
        return ((+r & 255) << 16) | ((+g & 255) << 8) | (+b & 255)
    } else {
        throw new Error('Could not parse RGB string : ' + sInput)
    }
}

function parseHSLString(sInput) {
    const x = sInput.match(REGEXP_HSL)
    if (x) {
        let [, h, unit, s, l] = x
        h = parseFloat(h) * (unit === 'rad' ? (180 / Math.PI) : 1)
        return _convertHSLToRGB(h, parseFloat(s), parseFloat(l))
    } else {
        throw new Error('Could not parse HSL string : ' + sInput)
    }
}

function _convertRGBToHSL(nColor) {
    let r = (nColor >> 16) & 0xff;
    let g = (nColor >> 8) & 0xff;
    let b = nColor & 0xff;
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
        ? l === r
            ? (g - b) / s
            : l === g
                ? 2 + (b - r) / s
                : 4 + (r - g) / s
        : 0;
    const hue = 60 * h < 0 ? 60 * h + 360 : 60 * h;
    const saturation = 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0);
    const luminance = (100 * (2 * l - s)) / 2;
    return {
        hue,
        saturation,
        luminance
    };
}

function _convertHSLToRGB(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const r = 255 * f(0) & 0xff;
    const g = 255 * f(8) & 0xff;
    const b = 255 * f(4) & 0xff;
    return r << 16 | g << 8 | b
}

/**
 * Parse a color from css or hex notation to a number version of the color
 * @param input {ColorType}
 * @returns {ColorNumber}
 */
export function parse(input) {
    const sType = typeof input
    if (sType === 'number') {
        return input
    } else if (sType === 'string') {
        if (input in htmlColorCodes) {
            return parseRGBString(htmlColorCodes[input]);
        }
        const c = input.charAt(0)
        switch (c) {
            case 'r': {
                return parseRGBString(input);
            }

            case '#': {
                return parseHexString(input);
            }

            case 'h': {
                return parseHSLString(input);
            }

            default: {
                throw new TypeError('unknown color type : ' + input)
            }
        }
    }
}

/**
 * Computes a new color of an input color, with brightness modification
 * @param input {ColorType}
 * @returns {ColorNumber}
 */
export function brightness (input, f) {
    let nColor = parse(input);
    let r = nColor >> 16 & 0xff;
    let g = nColor >> 8 & 0xff;
    let b = nColor & 0xff;
    r = f * r & 0xff;
    g = f * g & 0xff;
    b = f * b & 0xff;
    return r << 16 | g << 8 | b;
}

/**
 * Computes a grayscaled color of an input color
 * @param input {ColorType}
 * @returns {ColorNumber}
 */
export function grayscale(input) {
    let c = parse(input);
    let r = c >> 16 & 0xff;
    let g = c >> 8 & 0xff;
    let b = c & 0xff;
    let n = Math.round((r * 30 + g * 59 + b * 11) / 100) && 0xff;
    r = g = b = n;
    return r << 16 | g << 8 | b;
}

export function hueRotate (input, angle) {
    const c = parse(input);
    let { hue, saturation, luminance } = _convertRGBToHSL(c)
    hue += angle;
    while (hue < 0) {
        hue += 360;
    }
    while (hue >= 360) {
        hue -= 360;
    }
    return _convertHSLToRGB(hue, saturation, luminance);
}

/**
 * Computes a color between 2 other colors
 * @param x1 {ColorType}
 * @param x2 {ColorType}
 * @returns {ColorNumber}
 */
export function getMedian(x1, x2) {
    const c1 = parse(x1);
    const c2 = parse(x2);
    const r1 = c1 >> 16 & 0xff
    const g1 = c1 >> 8 & 0xff
    const b1 = c1 & 0xff
    const r2 = c2 >> 16 & 0xff
    const g2 = c2 >> 8 & 0xff
    const b2 = c2 & 0xff
    return ((r1 + r2) >> 1 & 0xff) << 16 |
        ((g1 + g2) >> 1 & 0xff) << 8 |
        ((b1 + b2) >> 1 & 0xff);
}

/**
 * Interpolates all colors between two.
 * @param sColor1 {ColorType}
 * @param sColor2 {ColorType}
 * @param nSteps {number}
 * @returns {ColorNumber[]}
 */
export function spectrum (sColor1, sColor2, nSteps) {
    let c1 = parse(sColor1);
    let c2 = parse(sColor2);

    function fillArray(a, x1, x2, n1, n2) {
        const c1 = parse(x1)
        const c2 = parse(x2)
        let m = getMedian(x1, x2);
        let n = (n1 + n2) >> 1;
        if (Math.abs(n1 - n2) > 1) {
            fillArray(a, c1, m, n1, n);
            fillArray(a, m, c2, n, n2);
        }
        a[n1] = c1;
        a[n2] = c2;
        return a;
    }

    return fillArray([], c1, c2, 0, nSteps - 1);
}

/**
 * Creates a palette out of a map of (index, color)
 * @param aStops {Map<number, ColorType> | { index: number, color: ColorType }[]}
 * @returns {ColorNumber[]}
 */
export function createPalette (aStops) {
    if (!aStops.every(s => (typeof s.index === 'number') && ('color' in s))) {
        throw new Error('Invalid palette input structure (need { index: number, color }[])')
    }
    let aPalette = [];
    let nLastIndex = 0;
    let nLastColor = null;
    const stops = (aStops instanceof Map)
        ? aStops.entries()
        : aStops.map(({ index, color }) => [index, color]);
    for (const [index, color] of stops) {
        const nColor = parse(color)
        if (nLastColor !== null) {
            aPalette = aPalette.concat(spectrum(nLastColor, nColor, index - nLastIndex + 1).slice(1));
        } else {
            aPalette[index] = nColor;
        }
        nLastColor = nColor;
        nLastIndex = index;
    }
    return aPalette;
}

/**
 *
 * @param n {number}
 * @private
 */
function _renderHexByte (n) {
    const s = n.toString(16)
    return n < 16 ? ('0' + s) : s
}

export function toHex (input) {
    const c = parse(input);
    const r = c >> 16 & 0xff;
    const g = c >> 8 & 0xff;
    const b = c & 0xff;
    return '#' + _renderHexByte(r) + _renderHexByte(g) + _renderHexByte(b)
}

export function toRGB (input) {
    const c = parse(input);
    const r = c >> 16 & 0xff;
    const g = c >> 8 & 0xff;
    const b = c & 0xff;
    return `rgb(${r},${g},${b})`;
}
