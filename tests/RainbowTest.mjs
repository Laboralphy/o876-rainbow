import Rainbow, { Color } from '../src/Rainbow.js';

describe('#parse', function() {
    it('should return rgba(0, 0, 0, 1) when parsing 3 digit color code #000', function() {
        expect(Rainbow.rgba('#000')).toBe('rgba(0, 0, 0, 1)');
    })
    it('should parse color structure', function() {
        expect(Rainbow.rgba({ r: 129, g: 66, b: 177, a: 255})).toBe('rgba(129, 66, 177, 1)');
    })
    it('should parse color structure', function() {
        expect(Rainbow.rgba({ r: 129, g: 66, b: 177, a: 255})).toBe('rgba(129, 66, 177, 1)');
    })
    it('should parse 1', function () {
        const x = Rainbow.parse('blue')
        expect(x).toBeInstanceOf(Color)
        expect(x.hex(3)).toBe('#00f')
        expect(x.hex(6)).toBe('#0000ff')
        expect(x.hex(8)).toBe('#0000ffff')
        expect(x.rgba()).toBe('rgba(0, 0, 255, 1)')
        expect(x.rgb()).toBe('rgb(0, 0, 255)')
    })
    it('should understand color lightgoldenrodyellow', function () {
        // lightgoldenrodyellow #FAFAD2
        const x = Rainbow.parse('lightgoldenrodyellow')
        expect(x.hex(3)).toBe('#ffd')
        expect(x.hex(6)).toBe('#fafad2')
        expect(x.hex(8)).toBe('#fafad2ff')
        expect(x.rgba()).toBe('rgba(250, 250, 210, 1)')
        expect(x.rgb()).toBe('rgb(250, 250, 210)')
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
        expect(Rainbow.int32('rgba(88, 7, 1, 1)')).toBe(0xFF010758 | 0)
    })
})

describe('hsl', function () {
    it ('should return red when parsing hsl 0, 100, 50', function () {
        const sColor1 = 'hsl(0, 100%, 50%)'
        const sColor2 = '#ff0000'
        const oColor3 = Rainbow.parse(sColor1)
        expect(oColor3.hex()).toBe(sColor2)
    })
    it ('should return green when parsing hsl 0, 100, 50', function () {
        const sColor1 = 'hsl(90, 100%, 50%)'
        const sColor2 = '#7fff00'
        const oColor3 = Rainbow.parse(sColor1)
        expect(oColor3.hex()).toBe(sColor2)
    })
})
