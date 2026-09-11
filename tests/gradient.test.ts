import { describe, expect, it } from 'vitest';
import { Rainbow } from '../src/Rainbow';

const BLACK = 0x000000ff;
const WHITE = 0xffffffff;
const RED = 0xff0000ff;
const BLUE = 0x0000ffff;

describe('Rainbow gradients', () => {
    describe('lerpColor', () => {
        it('returns the endpoints at t=0 and t=1', () => {
            expect(Rainbow.lerpColor(BLACK, WHITE, 0)).toBe(BLACK);
            expect(Rainbow.lerpColor(BLACK, WHITE, 1)).toBe(WHITE);
        });

        it('interpolates each channel independently', () => {
            expect(Rainbow.lerpColor(BLACK, WHITE, 0.5)).toBe(0x808080ff);
            expect(Rainbow.lerpColor(RED, BLUE, 0.5)).toBe(0x800080ff);
        });

        it('interpolates alpha too', () => {
            expect(Rainbow.lerpColor(0xff000000, 0xff0000ff, 0.5)).toBe(0xff000080);
        });
    });

    describe('getMedianColor', () => {
        it('averages the two colours channel by channel', () => {
            expect(Rainbow.getMedianColor(BLACK, WHITE)).toBe(0x808080ff);
            expect(Rainbow.getMedianColor(RED, BLUE)).toBe(0x800080ff);
        });

        it('is the identity for two equal colours', () => {
            expect(Rainbow.getMedianColor(RED, RED)).toBe(RED);
        });
    });

    describe('multiLerpColor', () => {
        it('returns the single entry regardless of t', () => {
            expect(Rainbow.multiLerpColor([RED], 0)).toBe(RED);
            expect(Rainbow.multiLerpColor([RED], 1)).toBe(RED);
        });

        it('spans the array across [0, 1]', () => {
            const colors = [BLACK, RED, WHITE];
            expect(Rainbow.multiLerpColor(colors, 0)).toBe(BLACK);
            expect(Rainbow.multiLerpColor(colors, 0.5)).toBe(RED);
            expect(Rainbow.multiLerpColor(colors, 1)).toBe(WHITE);
        });

        it('interpolates inside a segment', () => {
            expect(Rainbow.multiLerpColor([BLACK, WHITE], 0.5)).toBe(0x808080ff);
            expect(Rainbow.multiLerpColor([BLACK, RED, WHITE], 0.25)).toBe(0x800000ff);
        });

        it('saturates at the endpoints for out-of-range t', () => {
            const colors = [BLACK, RED, WHITE];
            expect(Rainbow.multiLerpColor(colors, -1)).toBe(BLACK);
            expect(Rainbow.multiLerpColor(colors, 2)).toBe(WHITE);
            expect(Rainbow.multiLerpColor([RED], -5)).toBe(RED);
        });

        it('throws on an empty array', () => {
            expect(() => Rainbow.multiLerpColor([], 0.5)).toThrow(/colors array is empty/);
        });
    });

    describe('createPalette', () => {
        it('produces one entry per index up to the last stop', () => {
            const palette = Rainbow.createPalette([
                [0, BLACK],
                [255, WHITE],
            ]);
            expect(palette).toHaveLength(256);
            expect(palette[0]).toBe(BLACK);
            expect(palette[255]).toBe(WHITE);
            expect(palette[254]).toBeDefined();
        });

        it('interpolates linearly between stops', () => {
            const palette = Rainbow.createPalette([
                [0, BLACK],
                [2, WHITE],
            ]);
            expect(palette).toEqual([BLACK, 0x808080ff, WHITE]);
        });

        it('honours multiple stops', () => {
            const palette = Rainbow.createPalette([
                [0, BLACK],
                [2, RED],
                [4, WHITE],
            ]);
            expect(palette).toHaveLength(5);
            expect(palette[2]).toBe(RED);
            expect(palette[4]).toBe(WHITE);
        });

        it('sorts unordered stops before interpolating', () => {
            const sorted = Rainbow.createPalette([
                [0, BLACK],
                [2, WHITE],
            ]);
            const unsorted = Rainbow.createPalette([
                [2, WHITE],
                [0, BLACK],
            ]);
            expect(unsorted).toEqual(sorted);
        });

        it('accepts a lone stop at index 0', () => {
            expect(Rainbow.createPalette([[0, RED]])).toEqual([RED]);
        });

        it('throws when there are no stops', () => {
            expect(() => Rainbow.createPalette([])).toThrow(/stopColors is empty/);
        });

        it('throws when the lowest stop is not index 0', () => {
            expect(() =>
                Rainbow.createPalette([
                    [1, BLACK],
                    [5, WHITE],
                ])
            ).toThrow(/first stop must be at index 0/);
        });
    });
});
