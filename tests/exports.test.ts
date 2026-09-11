import { describe, expect, it } from 'vitest';
import * as api from '../src/index';
import { HTML_COLORS } from '../src/html-colors';

describe('public entry point', () => {
    it('exports the documented surface', () => {
        expect(Object.keys(api).sort()).toEqual(['HTML_COLORS', 'Rainbow']);
    });

    it('ships the full CSS named-colour table', () => {
        expect(Object.keys(HTML_COLORS)).toHaveLength(148);
    });

    it('stores every named colour as an opaque Color32', () => {
        for (const [name, value] of Object.entries(HTML_COLORS)) {
            expect(value, name).toBeGreaterThanOrEqual(0);
            expect(value, name).toBeLessThanOrEqual(0xffffffff);
            expect(value & 0xff, name).toBe(0xff);
        }
    });

    it('agrees with a handful of known CSS values', () => {
        expect(HTML_COLORS.black).toBe(0x000000ff);
        expect(HTML_COLORS.white).toBe(0xffffffff);
        expect(HTML_COLORS.rebeccapurple).toBe(0x663399ff);
    });
});
