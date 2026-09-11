import { describe, expect, it } from 'vitest';
import { Rainbow } from '../src/Rainbow';

describe('Rainbow.parse', () => {
    describe('hex notation', () => {
        it('expands #RGB to full 8-bit channels with opaque alpha', () => {
            expect(Rainbow.parse('#000')).toBe(0x000000ff);
            expect(Rainbow.parse('#fff')).toBe(0xffffffff);
            expect(Rainbow.parse('#f0a')).toBe(0xff00aaff);
        });

        it('expands #RGBA including the alpha nibble', () => {
            expect(Rainbow.parse('#0000')).toBe(0x00000000);
            expect(Rainbow.parse('#f00f')).toBe(0xff0000ff);
            expect(Rainbow.parse('#1238')).toBe(0x11223388);
        });

        it('reads #RRGGBB as opaque', () => {
            expect(Rainbow.parse('#fafad2')).toBe(0xfafad2ff);
            expect(Rainbow.parse('#0000ff')).toBe(0x0000ffff);
        });

        it('reads #RRGGBBAA verbatim', () => {
            expect(Rainbow.parse('#8142b180')).toBe(0x8142b180);
        });

        it('is case-insensitive and tolerates surrounding whitespace', () => {
            expect(Rainbow.parse('  #FAFAD2  ')).toBe(0xfafad2ff);
        });

        it('rejects hex strings of an unsupported length', () => {
            expect(() => Rainbow.parse('#12345')).toThrow(/invalid hex/);
            expect(() => Rainbow.parse('#1')).toThrow(/invalid hex/);
        });
    });

    describe('named colours', () => {
        it('resolves the CSS keyword table', () => {
            expect(Rainbow.parse('blue')).toBe(0x0000ffff);
            expect(Rainbow.parse('lightgoldenrodyellow')).toBe(0xfafad2ff);
            expect(Rainbow.parse('cornflowerblue')).toBe(0x6495edff);
        });

        it('matches keywords regardless of case', () => {
            expect(Rainbow.parse('ReD')).toBe(0xff0000ff);
        });

        it('rejects unknown keywords', () => {
            expect(() => Rainbow.parse('mauve')).toThrow(/unrecognised format/);
        });
    });

    describe('rgb() / rgba()', () => {
        it('parses comma-separated integer channels', () => {
            expect(Rainbow.parse('rgb(0, 0, 255)')).toBe(0x0000ffff);
            expect(Rainbow.parse('rgb(129,66,177)')).toBe(0x8142b1ff);
        });

        it('parses rgba() with a 0-1 float alpha', () => {
            expect(Rainbow.parse('rgba(255, 0, 0, 0.5)')).toBe(0xff000080);
            expect(Rainbow.parse('rgba(255, 0, 0, 1)')).toBe(0xff0000ff);
            expect(Rainbow.parse('rgba(255, 0, 0, 0)')).toBe(0xff000000);
        });

        it('accepts percentage channels', () => {
            expect(Rainbow.parse('rgb(100%, 0%, 50%)')).toBe(0xff0080ff);
        });

        it('accepts CSS Level 4 space-and-slash syntax', () => {
            expect(Rainbow.parse('rgb(0 0 255)')).toBe(0x0000ffff);
            expect(Rainbow.parse('rgb(255 0 0 / 0.5)')).toBe(0xff000080);
        });

        it('clamps out-of-range channels into 0-255', () => {
            expect(Rainbow.parse('rgb(300, -20, 255)')).toBe(0xff00ffff);
        });

        it('rejects fewer than three channels', () => {
            expect(() => Rainbow.parse('rgb(1, 2)')).toThrow(/malformed rgb/);
        });
    });

    describe('hsl() / hsla()', () => {
        it('parses the primary hues', () => {
            expect(Rainbow.parse('hsl(0, 100%, 50%)')).toBe(0xff0000ff);
            expect(Rainbow.parse('hsl(120, 100%, 50%)')).toBe(0x00ff00ff);
            expect(Rainbow.parse('hsl(240, 100%, 50%)')).toBe(0x0000ffff);
        });

        it('treats zero saturation as greyscale', () => {
            expect(Rainbow.parse('hsl(210, 0%, 50%)')).toBe(0x808080ff);
            expect(Rainbow.parse('hsl(0, 0%, 100%)')).toBe(0xffffffff);
            expect(Rainbow.parse('hsl(0, 0%, 0%)')).toBe(0x000000ff);
        });

        it('parses hsla() alpha', () => {
            expect(Rainbow.parse('hsla(0, 100%, 50%, 0.5)')).toBe(0xff000080);
        });

        it('accepts CSS Level 4 space-and-slash syntax', () => {
            expect(Rainbow.parse('hsl(120 100% 50% / 0.5)')).toBe(0x00ff0080);
        });

        it('accepts deg, turn, rad and grad hue units', () => {
            const green = 0x00ff00ff;
            expect(Rainbow.parse('hsl(120deg, 100%, 50%)')).toBe(green);
            expect(Rainbow.parse('hsl(0.3333333turn, 100%, 50%)')).toBe(green);
            expect(Rainbow.parse('hsl(133.3333grad, 100%, 50%)')).toBe(green);
            expect(Rainbow.parse('hsl(2.0943951rad, 100%, 50%)')).toBe(green);
        });

        it('wraps hues outside 0-360', () => {
            expect(Rainbow.parse('hsl(480, 100%, 50%)')).toBe(Rainbow.parse('hsl(120, 100%, 50%)'));
            expect(Rainbow.parse('hsl(-120, 100%, 50%)')).toBe(
                Rainbow.parse('hsl(240, 100%, 50%)')
            );
        });

        it('covers both lightness branches of the HSL conversion', () => {
            // l < 0.5 and l > 0.5 take different code paths.
            expect(Rainbow.parse('hsl(0, 100%, 25%)')).toBe(0x800000ff);
            expect(Rainbow.parse('hsl(0, 100%, 75%)')).toBe(0xff8080ff);
        });

        it('rejects fewer than three channels', () => {
            expect(() => Rainbow.parse('hsl(1, 2%)')).toThrow(/malformed hsl/);
        });
    });

    describe('invalid input', () => {
        it('rejects an unsupported colour function', () => {
            expect(() => Rainbow.parse('lab(50% 40 59)')).toThrow(/unsupported function/);
        });

        it('rejects free-form garbage', () => {
            expect(() => Rainbow.parse('not a color')).toThrow(/unrecognised format/);
            expect(() => Rainbow.parse('')).toThrow(/unrecognised format/);
        });
    });
});
