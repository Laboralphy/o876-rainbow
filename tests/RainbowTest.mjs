import Rainbow from '../src/Rainbow.js';

describe('#parse', function() {
    it('should parse 3 digit color code', function() {
        expect(Rainbow.rgba('#000')).toBe('rgba(0, 0, 0, 255)');
    })
})

describe('#spectrum', function() {
    it('should generate 256 array', function() {
        const s = Rainbow.spectrum('#000', '#FFF', 256)
        expect(s[254]).toBeDefined()
    })
})