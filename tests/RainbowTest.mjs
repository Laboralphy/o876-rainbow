import Rainbow from '../src/Rainbow.js';

describe('#parse', function() {
    it('should parse 3 digit color code', function() {
        expect(Rainbow.rgba('#000')).toBe('rgba(0, 0, 0, 255)');
    })
})