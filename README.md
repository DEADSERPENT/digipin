# digipinpy

[![PyPI version](https://badge.fury.io/py/digipinpy.svg)](https://badge.fury.io/py/digipinpy)
[![Python](https://img.shields.io/pypi/pyversions/digipinpy.svg)](https://pypi.org/project/digipinpy/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](tests/)

Official Python implementation of **DIGIPIN** (Digital Postal Index Number), the national geocoding standard for India developed by the Department of Posts, Ministry of Communications, Government of India.

DIGIPIN provides a standardized 10-character alphanumeric code for any location in India with ~3.8 meter precision, covering the entire geographic territory including maritime Exclusive Economic Zone.

## Installation

```bash
pip install digipinpy
```

## Quick Start

```python
from digipin import encode, decode

# Encode coordinates to DIGIPIN code
code = encode(28.622788, 77.213033)  # Dak Bhawan, New Delhi
print(code)  # Output: 39J49LL8T4

# Decode DIGIPIN code to coordinates
lat, lon = decode('39J49LL8T4')
print(f"{lat:.6f}, {lon:.6f}")  # Output: 28.622788, 77.213033
```

## Features

- **Zero Dependencies** - Pure Python implementation
- **High Precision** - ~3.8m accuracy at level 10
- **Hierarchical** - Variable precision from 1km to 3.8m
- **Validated** - 100% compliant with official specification
- **Comprehensive** - Complete coverage of India's geographic territory
- **Well-Tested** - 31 test cases covering all edge cases

## Documentation

For detailed documentation, examples, and API reference, see [DOCUMENTATION.md](DOCUMENTATION.md)

## Specification

This implementation strictly follows the official DIGIPIN specification published by:
- **Department of Posts**, Ministry of Communications, Government of India
- **Technical Document** – Final Version, March 2025

### Coverage Area
- **Latitude**: 2.5°N to 38.5°N
- **Longitude**: 63.5°E to 99.5°E
- **Coordinate System**: EPSG:4326 (WGS84)

### Character Set
16-symbol alphabet: `23456789CFJKLMPT`

## API Overview

### Core Functions
```python
encode(lat, lon, *, precision=10)       # Coordinates → DIGIPIN
decode(code)                             # DIGIPIN → Coordinates
is_valid(code)                           # Validate DIGIPIN code
```

### Batch Operations
```python
batch_encode(coordinates)                # Encode multiple locations
batch_decode(codes)                      # Decode multiple codes
```

### Hierarchical Operations
```python
get_parent(code, level)                  # Get parent region code
is_within(child_code, parent_code)       # Check containment
get_bounds(code)                         # Get grid cell boundaries
```

## Testing

```bash
pytest tests/ -v
```

All 31 tests pass with 100% specification compliance.

## Requirements

- Python 3.7+
- No external dependencies

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- **Documentation**: [DOCUMENTATION.md](DOCUMENTATION.md)
- **Source Code**: https://github.com/DEADSERPENT/digipinpy
- **Issue Tracker**: https://github.com/DEADSERPENT/digipinpy/issues
- **PyPI**: https://pypi.org/project/digipinpy/

## Citation

If you use this library in research or production, please cite:

```
Department of Posts, Ministry of Communications, Government of India.
"Digital Postal Index Number (DIGIPIN) - Technical Document, Final Version."
March 2025.
```

## Authors

**SAMARTHA H V** - Lead Developer
**MR SHIVAKUMAR** - Maintainer

---

**Government of India | Department of Posts | National Addressing Initiative**
