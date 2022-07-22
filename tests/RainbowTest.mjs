import Rainbow from '../src/Rainbow.js';

describe('#parse', function() {
    it('should parse 3 digit color code', function() {
        expect(Rainbow.rgba('#000')).toBe('rgba(0, 0, 0, 1)');
    })
    it('should parse color structure', function() {
        expect(Rainbow.rgba({ r: 129, g: 66, b: 177, a: 255})).toBe('rgba(129, 66, 177, 1)');
    })
})

describe('#spectrum', function() {
    it('should generate 256 array', function() {
        const s = Rainbow.spectrum('#000', '#FFF', 256)
        expect(s[254]).toBeDefined()
    })
})

describe('#int32', function() {
    it('should return 0 (alpha 0 too)', function () {
        expect(Rainbow.int32('rgba(0, 0, 0, 0)')).toBe(0)
    })
    it('should return a number value with full alpha', function () {
        expect(Rainbow.int32('rgba(8, 7, 1, 1)')).toBe(0xFF010708 | 0)
    })
})