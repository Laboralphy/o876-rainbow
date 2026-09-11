# @laboralphy/rainbow

Parse, convert, render and interpolate colors. Written in TypeScript, published
for both TypeScript and JavaScript projects (ESM and CommonJS).

## Install

```bash
npm install @laboralphy/rainbow
```

## Usage

TypeScript / ESM:

```ts
import { Rainbow } from '@laboralphy/rainbow';
import type { Color32 } from '@laboralphy/rainbow';

const purple: Color32 = Rainbow.parse('rebeccapurple');

Rainbow.renderHex6(purple); // '#663399'
Rainbow.renderRGBA(purple); // 'rgba(102, 51, 153, 1)'
Rainbow.convertToHSLA(purple); // { h: 0.75, s: ~0.5, l: 0.4, a: 1 }
```

CommonJS:

```js
const { Rainbow } = require('@laboralphy/rainbow');

Rainbow.renderHex6(Rainbow.parse('hsl(120 100% 50%)')); // '#00ff00'
```

## Color representations

| Type              | Shape               | Range              |
| ----------------- | ------------------- | ------------------ |
| `Color32`         | packed `0xRRGGBBAA` | each channel 0–255 |
| `ColorRGBAStruct` | `{ r, g, b, a }`    | each channel 0–1   |
| `ColorHSLAStruct` | `{ h, s, l, a }`    | each channel 0–1   |

`Color32` is the currency of the library: every function takes or returns one.
Struct channels are floating point, so conversions are accurate but not always
exact — compare with a tolerance rather than `===`.

## API

### Parsing

`Rainbow.parse(css: string): Color32`

Accepts:

- hex — `#RGB`, `#RGBA`, `#RRGGBB`, `#RRGGBBAA`
- `rgb(r, g, b)` / `rgba(r, g, b, a)`, channels as `0–255` or percentages
- `hsl(h, s%, l%)` / `hsla(h, s%, l%, a)`, hue in `deg`, `turn`, `rad` or `grad`
- CSS Level 4 space-and-slash syntax — `rgb(255 0 0 / 0.5)`, `hsl(120 100% 50% / 0.5)`
- all 148 CSS named colors — `red`, `cornflowerblue`, `rebeccapurple`, …

Throws on anything it cannot parse.

### Conversion

| Function                           | Returns           |
| ---------------------------------- | ----------------- |
| `Rainbow.convertToRGBA(color)`     | `ColorRGBAStruct` |
| `Rainbow.convertToHSLA(color)`     | `ColorHSLAStruct` |
| `Rainbow.fromRGBA({ r, g, b, a })` | `Color32`         |
| `Rainbow.fromHSLA({ h, s, l, a })` | `Color32`         |

### Rendering

| Function                    | Example output            |
| --------------------------- | ------------------------- |
| `Rainbow.renderHex6(color)` | `'#663399'`               |
| `Rainbow.renderHex3(color)` | `'#639'`                  |
| `Rainbow.renderRGB(color)`  | `'rgb(102, 51, 153)'`     |
| `Rainbow.renderRGBA(color)` | `'rgba(102, 51, 153, 1)'` |

Hex and `renderRGB` discard alpha. `renderHex3` rounds each channel to the
nearest 4-bit nibble.

### Gradients

```ts
// Blend two colors; t = 0 returns c1, t = 1 returns c2.
Rainbow.lerpColor(c1, c2, 0.5);

// Shorthand for lerpColor(c1, c2, 0.5).
Rainbow.getMedianColor(c1, c2);

// Blend across an ordered array; t is clamped to [0, 1].
Rainbow.multiLerpColor([black, red, white], 0.25);

// Build an indexed palette from stops. The result has (lastIndex + 1)
// entries, linearly interpolated between stops. The lowest stop must be 0.
const ramp = Rainbow.createPalette([
  [0, Rainbow.parse('black')],
  [128, Rainbow.parse('red')],
  [255, Rainbow.parse('white')],
]); // ramp.length === 256
```

### Named colors

`HTML_COLORS` is the raw lookup table — lowercase name to opaque `Color32`.

```ts
import { HTML_COLORS } from '@laboralphy/rainbow';
HTML_COLORS.cornflowerblue; // 0x6495edff
```

## Development

```bash
npm run build          # bundle ESM + CJS + .d.ts via tsup/esbuild
npm test               # run the vitest suite
npm run test:coverage  # run with coverage thresholds
npm run lint           # eslint (type-aware)
npm run format         # prettier --write
npm run typecheck      # tsc --noEmit
npm run check          # format:check + lint + typecheck + test
```

## License

ISC © Raphaël Marandet
