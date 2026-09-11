import { describe, expect, it } from 'vitest';
import { Rainbow } from '../src/Rainbow';

describe('Rainbow conversions', () => {
    describe('convertToRGBA', () => {
        it('unpacks each channel into 0-1', () => {
            expect(Rainbow.convertToRGBA(0xff0000ff)).toEqual({ r: 1, g: 0, b: 0, a: 1 });
            expect(Rainbow.convertToRGBA(0x00000000)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
        });

        it('unpacks intermediate values', () => {
            const { r, g, b, a } = Rainbow.convertToRGBA(0x8040c080);
            expect(r).toBeCloseTo(0x80 / 255, 10);
            expect(g).toBeCloseTo(0x40 / 255, 10);
            expect(b).toBeCloseTo(0xc0 / 255, 10);
            expect(a).toBeCloseTo(0x80 / 255, 10);
        });
    });

    describe('fromRGBA', () => {
        it('packs 0-1 channels back into a Color32', () => {
            expect(Rainbow.fromRGBA({ r: 1, g: 0, b: 0, a: 1 })).toBe(0xff0000ff);
            expect(Rainbow.fromRGBA({ r: 0, g: 0, b: 0, a: 0 })).toBe(0x00000000);
        });

        it('clamps channels outside 0-1', () => {
            expect(Rainbow.fromRGBA({ r: 2, g: -1, b: 0.5, a: 1 })).toBe(0xff0080ff);
        });

        it('round-trips through convertToRGBA', () => {
            for (const color of [0x000000ff, 0xfafad2ff, 0x8142b180, 0xffffffff, 0x12345678]) {
                expect(Rainbow.fromRGBA(Rainbow.convertToRGBA(color))).toBe(color);
            }
        });
    });

    describe('convertToHSLA', () => {
        it('reports achromatic colours as hue 0 / saturation 0', () => {
            expect(Rainbow.convertToHSLA(0x808080ff)).toMatchObject({ h: 0, s: 0 });
            expect(Rainbow.convertToHSLA(0x000000ff)).toEqual({ h: 0, s: 0, l: 0, a: 1 });
            expect(Rainbow.convertToHSLA(0xffffffff)).toEqual({ h: 0, s: 0, l: 1, a: 1 });
        });

        it('computes hue for each dominant channel', () => {
            expect(Rainbow.convertToHSLA(0xff0000ff).h).toBeCloseTo(0, 5);
            expect(Rainbow.convertToHSLA(0x00ff00ff).h).toBeCloseTo(1 / 3, 5);
            expect(Rainbow.convertToHSLA(0x0000ffff).h).toBeCloseTo(2 / 3, 5);
        });

        it('wraps hue past red when green is below blue', () => {
            // magenta — max is red, g < b, so the +6 wrap branch applies
            expect(Rainbow.convertToHSLA(0xff00ffff).h).toBeCloseTo(5 / 6, 5);
        });

        it('covers both lightness branches of the saturation formula', () => {
            expect(Rainbow.convertToHSLA(0x800000ff)).toMatchObject({ s: 1 });
            expect(Rainbow.convertToHSLA(0xff8080ff).s).toBeCloseTo(1, 2);
        });

        it('preserves alpha', () => {
            expect(Rainbow.convertToHSLA(0xff000000).a).toBe(0);
            expect(Rainbow.convertToHSLA(0xff0000ff).a).toBe(1);
        });
    });

    describe('fromHSLA', () => {
        it('packs the primary hues', () => {
            expect(Rainbow.fromHSLA({ h: 0, s: 1, l: 0.5, a: 1 })).toBe(0xff0000ff);
            expect(Rainbow.fromHSLA({ h: 1 / 3, s: 1, l: 0.5, a: 1 })).toBe(0x00ff00ff);
            expect(Rainbow.fromHSLA({ h: 2 / 3, s: 1, l: 0.5, a: 1 })).toBe(0x0000ffff);
        });

        it('handles the achromatic shortcut', () => {
            expect(Rainbow.fromHSLA({ h: 0.5, s: 0, l: 0.5, a: 1 })).toBe(0x808080ff);
        });

        it('round-trips saturated colours through convertToHSLA', () => {
            for (const color of [0xff0000ff, 0x00ff00ff, 0x0000ffff, 0x8142b1ff, 0xfafad2ff]) {
                expect(Rainbow.fromHSLA(Rainbow.convertToHSLA(color))).toBe(color);
            }
        });
    });
});
