<div align="center">
# DIGIPIN-JS

**Offline geocoding for India's national addressing standard**

Transform coordinates into precise, hierarchical digital addresses — no API required.

<br>

[![NPM](https://img.shields.io/npm/v/digipin-js?color=CB3837&logo=npm)](https://www.npmjs.com/package/digipin-js)
[![Size](https://img.shields.io/bundlephobia/minzip/digipin-js?label=gzipped)](https://bundlephobia.com/package/digipin-js)
[![TypeScript](https://img.shields.io/badge/types-included-blue?logo=typescript)](digipin.d.ts)
[![Tests](https://img.shields.io/badge/tests-60%2B%20passing-success)](test.js)

[🐍 Python Version](https://github.com/DEADSERPENT/digipinpy) • [📖 Full Docs](https://github.com/DEADSERPENT/digipinpy/tree/main/docs)

</div>

---

## Quick Start

```bash
npm install digipin-js
```

```javascript
import { encode, decode, getNeighbors, getDisk } from 'digipin-js';

// Encode: Coordinates → DIGIPIN
const pin = encode(28.622788, 77.213033);  // '39J49LL8T4'

// Decode: DIGIPIN → Coordinates
const { lat, lon } = decode('39J49LL8T4');

// Find neighbors
const neighbors = getNeighbors(pin);       // 8 adjacent cells

// Search radius
const area = getDisk(pin, 5);              // 11×11 grid (~300m)
```

---

## Features

| Core | Geospatial | Developer |
|------|-----------|-----------|
| ✅ Encode/Decode | ✅ Neighbor discovery | ✅ TypeScript types |
| ✅ Validation | ✅ Radius search | ✅ Zero dependencies |
| ✅ Bounding boxes | ✅ Batch operations | ✅ < 5KB gzipped |

---

## API Reference

### Core

```javascript
encode(lat, lon, precision?)     // → '39J49LL8T4'
decode(code)                     // → { lat: 28.6, lon: 77.2 }
isValid(code, strict?)           // → true/false
getBounds(code)                  // → { minLat, maxLat, minLon, maxLon }
getParent(code, level)           // → '39J49' (parent at level 5)
```

### Geospatial

```javascript
getNeighbors(code, direction?)   // → [...] (8 neighbors or filtered)
getDisk(code, radius?)           // → [...] (all cells within radius)
batchEncode(coords, precision?)  // → [...] (encode multiple)
batchDecode(codes)               // → [...] (decode multiple)
```

**Directions:** `'all'` | `'cardinal'` | `'north'` | `'south'` | `'east'` | `'west'` | `'northeast'` | `'northwest'` | `'southeast'` | `'southwest'`

---

## Precision Levels

| Level | Resolution | Use Case |
|-------|-----------|----------|
| 1-2 | ~250 km | State/Region |
| 5-6 | ~1 km | Delivery zones |
| 10 | ~4 m | Doorstep |

---

## Platform Support

✅ **Node.js** (v10+)
✅ **Browsers** (Modern ES6+)
✅ **TypeScript** (Full definitions)
✅ **React Native** (Compatible)

### Installation

```bash
# NPM
npm install digipin-js

# Yarn
yarn add digipin-js

# Browser CDN
<script src="https://cdn.jsdelivr.net/npm/digipin-js"></script>
```

---

## Real-World Example

```javascript
// Store locator: Find nearby locations
const customerPin = encode(userLat, userLon, 8);
const searchArea = getDisk(customerPin, 5);

const nearby = stores.filter(store =>
  searchArea.includes(store.digipin)
);
```

---

## DIGIPIN Ecosystem

| Package | Environment | Status |
|---------|------------|--------|
| [digipinpy](https://github.com/DEADSERPENT/digipinpy) | Python 3.7+ |
| **digipin-js** | JavaScript/TS | 
| digipin-flask | Flask |
| digipin-django | Django |

---

## Testing

```bash
npm test  # 60+ tests, 100% pass rate
```

---

## License

**MIT** — Free for commercial use.

Based on the official specification by **Department of Posts, Ministry of Communications, Government of India**.

---

## Links

📦 [NPM](https://www.npmjs.com/package/digipin-js) • 🐍 [Python](https://github.com/DEADSERPENT/digipinpy) • 📖 [Docs](https://github.com/DEADSERPENT/digipinpy/tree/main/docs) • 🐛 [Issues](https://github.com/DEADSERPENT/digipinpy/issues)

<div align="center">
<sub>Maintained by SAMARTHA H V & MR SHIVAKUMAR</sub>
</div>
