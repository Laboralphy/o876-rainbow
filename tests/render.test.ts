import { describe, expect, it } from 'vitest';
import { Rainbow } from '../src/Rainbow';

describe('Rainbow renderers', () => {
    describe('renderHex6', () => {
        it('pads every channel to two digits', () => {
            expect(Rainbow.renderHex6(0x000000ff)).toBe('#000000');
            expect(Rainbow.renderHex6(0x0a0b0cff)).toBe('#0a0b0c');
            expect(Rainbow.renderHex6(0xfafad2ff)).toBe('#fafad2');
        });

        it('discards alpha', () => {
            expect(Rainbow.renderHex6(0xff000000)).toBe('#ff0000');
        });
    });

    describe('renderHex3', () => {
        it('collapses each channel to its nearest nibble', () => {
            expect(Rainbow.renderHex3(0x0000ffff)).toBe('#00f');
            expect(Rainbow.renderHex3(0xffffffff)).toBe('#fff');
            // 0xd2 (210) is nearer to 0xcc (204) than to 0xdd (221), so it rounds down.
            // Note: v1/v2 truncated (`>> 4`) and produced '#ffd' here.
            expect(Rainbow.renderHex3(0xfafad2ff)).toBe('#ffc');
        });

        it('rounds up when the channel is past the midpoint', () => {
            // 0xd8 (216) sits above the 0xcc/0xdd midpoint, so it rounds to 'd'.
            expect(Rainbow.renderHex3(0xd8d8d8ff)).toBe('#ddd');
        });

        it('discards alpha', () => {
            expect(Rainbow.renderHex3(0xff000000)).toBe('#f00');
        });
    });

    describe('renderRGB', () => {
        it('emits integer channels', () => {
            expect(Rainbow.renderRGB(0x0000ffff)).toBe('rgb(0, 0, 255)');
            expect(Rainbow.renderRGB(0x8142b1ff)).toBe('rgb(129, 66, 177)');
        });

        it('discards alpha', () => {
            expect(Rainbow.renderRGB(0x8142b100)).toBe('rgb(129, 66, 177)');
        });
    });

    describe('renderRGBA', () => {
        it('emits alpha as a 0-1 float', () => {
            expect(Rainbow.renderRGBA(0x0000ffff)).toBe('rgba(0, 0, 255, 1)');
            expect(Rainbow.renderRGBA(0x00000000)).toBe('rgba(0, 0, 0, 0)');
        });

        it('trims alpha to at most three decimals', () => {
            expect(Rainbow.renderRGBA(0xff000080)).toBe('rgba(255, 0, 0, 0.502)');
        });
    });

    it('round-trips render -> parse for opaque colours', () => {
        for (const css of ['#fafad2', '#0000ff', '#8142b1']) {
            expect(Rainbow.renderHex6(Rainbow.parse(css))).toBe(css);
        }
    });
});
