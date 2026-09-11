import {
    parse,
    brightness,
    createPalette,
    getMedian,
    grayscale,
    spectrum,
    toHex,
    toRGB
} from '../src/rainbow2.js';

describe('#parse()', function() {
    it('should return 0x111111 when parsing #111111', function() {
        expect(parse('#111111')).toBe(0x111111);
    })

    it('should return 0xffffff when parsing #fff', function() {
        expect(parse('#fff')).toBe(0xffffff);
    })

    it('should return 0 when parsing #000', function() {
        expect(parse('#000')).toBe(0);
    })

    it('should return 0x808080 when parsing rgb(128, 128, 128)', function() {
        expect(parse('rgb(128, 128, 128)')).toBe(0x808080);
    })

    it('should return 0x808000 when parsing rgb(128, 128, 0)', function() {
        expect(parse('rgb(128, 128, 0)')).toBe(0x808000);
    })

    it('should return 0x800080 when parsing rgb(128, 0, 128)', function() {
        expect(parse('rgb(128, 0, 128)')).toBe(0x800080);
    })

    it('should return 0x008080 when parsing rgb(0, 128, 128)', function() {
        expect(parse('rgb(0, 128, 128)')).toBe(0x8080);
    })

    it('should return 0x008080 when parsing rgb(0, 128, 128)', function() {
        expect(parse('rgb(0.5, 128.95423, 128.00123)')).toBe(0x8080);
    })

    it('should return 0xff0000 when parsing hsl(0deg, 100%, 50%)', function() {
        expect(parse('hsl(0deg, 100%, 50%)')).toBe(0xff0000);
    })
    it('should return 0x800000 when parsing hsl(0deg, 100%, 25%)', function() {
        expect(parse('hsl(0deg, 100%, 25%)')).toBe(0x7f0000);
    })
})

