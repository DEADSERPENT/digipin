# DIGIPIN-Py Documentation

Welcome to the official documentation for **DIGIPIN-Py**, the Python implementation of India's national geocoding standard.

## Quick Navigation

- **[API Reference](DOCUMENTATION.md)** - Complete function reference and usage examples
- **[Technical Specification](technical_spec.md)** - Official DIGIPIN specification from Department of Posts
- **[GitHub Repository](https://github.com/DEADSERPENT/digipinpy)** - Source code and issue tracking
- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute to the project

## What is DIGIPIN?

DIGIPIN (Digital Postal Index Number) is India's new national geocoding system developed by the Department of Posts, Ministry of Communications, Government of India.

### Key Features

- **Hierarchical Grid System**: 10-level hierarchy from ~1000km down to ~3.8m precision
- **16-Character Alphabet**: `23456789CFJKLMPT` (excludes confusing characters)
- **Full India Coverage**: Latitude 2.5°N to 38.5°N, Longitude 63.5°E to 99.5°E
- **Spiral Anticlockwise Labeling**: Consistent, predictable cell ordering

## Installation

```bash
pip install digipinpy
```

## Quick Start

```python
from digipin import encode, decode, get_neighbors

# Encode coordinates to DIGIPIN
code = encode(28.622788, 77.213033)  # Dak Bhawan, New Delhi
print(code)  # '39J49LL8T4'

# Decode DIGIPIN to coordinates
lat, lon = decode('39J49LL8T4')
print(f"{lat:.6f}, {lon:.6f}")

# Find neighboring cells
neighbors = get_neighbors('39J49LL8T4')
print(neighbors)  # ['39J49LL8T9', '39J49LL8TC', ...]
```

## Core Capabilities

### 1. Encoding & Decoding

Convert between geographic coordinates and DIGIPIN codes with high precision.

```python
from digipin import encode, decode

# Variable precision encoding
code_10 = encode(28.622788, 77.213033, precision=10)  # ~3.8m accuracy
code_5 = encode(28.622788, 77.213033, precision=5)    # ~1km accuracy
```

### 2. Batch Operations

Process large datasets efficiently.

```python
from digipin import batch_encode, batch_decode

coords = [(28.622788, 77.213033), (19.076090, 72.877426)]
codes = batch_encode(coords)
```

### 3. Spatial Queries

Discover nearby locations and search areas.

```python
from digipin import get_neighbors, get_ring, get_disk

# Get 8 immediate neighbors
neighbors = get_neighbors('39J49LL8T4')

# Get cells at distance 2
ring = get_ring('39J49LL8T4', distance=2)

# Get all cells within radius 3
disk = get_disk('39J49LL8T4', radius=3)
```

### 4. Hierarchical Operations

Work with different precision levels.

```python
from digipin import get_parent, is_within, get_bounds

# Get parent region
parent = get_parent('39J49LL8T4', level=5)

# Check containment
is_within('39J49LL8T4', '39J49')  # True

# Get geographic bounds
bounds = get_bounds('39J49LL8T4')
# Returns: (lat_min, lat_max, lon_min, lon_max)
```

## Use Cases

### Logistics & Delivery

```python
# Find delivery zones near a hub
hub_code = encode(28.622788, 77.213033)
delivery_area = get_disk(hub_code, radius=5)
```

### Emergency Services

```python
# Locate nearest response units
incident = encode(19.076090, 72.877426)
search_area = get_ring(incident, distance=1)
```

### Urban Planning

```python
# Analyze coverage of a region
region = '39J49L'  # ~1km grid
child_cells = [region + c for c in DIGIPIN_ALPHABET[:16]]
```

### Data Science with Pandas

```python
import pandas as pd
import digipin.pandas_ext

df = pd.DataFrame({
    'lat': [28.622788, 19.076090],
    'lon': [77.213033, 72.877426]
})

# Encode entire columns
df['digipin'] = df.digipin.encode('lat', 'lon')

# Decode back
df[['lat_dec', 'lon_dec']] = df.digipin.decode('digipin')
```

## Specification Compliance

This library is **100% compliant** with the official DIGIPIN specification:

> **Department of Posts, Ministry of Communications, Government of India**
> *"Digital Postal Index Number (DIGIPIN) - Technical Document, Final Version"*
> March 2025

All encoding and decoding operations follow the exact algorithms specified in the official documentation.

## Performance Characteristics

- **Zero Dependencies**: Pure Python, no external libraries required
- **Fast Encoding**: ~50,000 encodes/second on modern hardware
- **Memory Efficient**: Stateless operations, minimal memory footprint
- **Thread Safe**: All functions are immutable and thread-safe

## Support & Community

- **Issues**: [GitHub Issue Tracker](https://github.com/DEADSERPENT/digipinpy/issues)
- **Discussions**: [GitHub Discussions](https://github.com/DEADSERPENT/digipinpy/discussions)
- **Email**: samarthsmg14@gmail.com, hmrshivu@gmail.com

## License

MIT License - See [LICENSE](../LICENSE) for details.

---

**Government of India | Department of Posts | National Addressing Initiative**
