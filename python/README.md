<div align="center">

# 🇮🇳 DIGIPIN-Py

**Implementation of India's national geocoding standard**

[![PyPI version](https://img.shields.io/pypi/v/digipinpy.svg?color=blue)](https://pypi.org/project/digipinpy/)
[![Python Version](https://img.shields.io/pypi/pyversions/digipinpy.svg)](https://pypi.org/project/digipinpy/)
[![License](https://img.shields.io/pypi/l/digipinpy.svg)](https://github.com/DEADSERPENT/digipin/blob/main/LICENSE)
[![Tests](https://github.com/DEADSERPENT/digipin/workflows/Tests/badge.svg)](https://github.com/DEADSERPENT/digipin/actions)
[![codecov](https://codecov.io/github/DEADSERPENT/digipin/graph/badge.svg?token=G8NZBWAWPY)](https://codecov.io/github/DEADSERPENT/digipin)
[![DOI](https://zenodo.org/badge/1101294193.svg)](https://doi.org/10.5281/zenodo.17916240)
[![Downloads](https://static.pepy.tech/badge/digipinpy)](https://pepy.tech/project/digipinpy)

[Documentation](https://github.com/DEADSERPENT/digipin/blob/main/docs/index.md) •
[API Reference](https://github.com/DEADSERPENT/digipin/blob/main/DOCUMENTATION.md) •
[Getting Started](https://github.com/DEADSERPENT/digipin/blob/main/docs/getting-started.md) •
[Contributing](CONTRIBUTING.md) •
[Changelog](CHANGELOG.md)

</div>

---

## What is DIGIPIN?

**DIGIPIN** (Digital Postal Index Number) is India's national geocoding system developed by the **Department of Posts, Ministry of Communications, Government of India**. It divides the entire country into a hierarchical grid, assigning a unique code to every ~4m × 4m location.

**digipinpy** is a high-performance, zero-dependency Python library implementing the official specification with 100% compliance.

### Key Features

- 🎯 **Pinpoint Accuracy** - ~3.8m precision at level 10
- 🗺️ **Hierarchical Grid** - Variable precision from 1000km down to 4m
- 📦 **Zero Dependencies** - Pure Python core, optional framework integrations
- ⚡ **High Performance** - ~50,000 encodes/second (pure Python), **~500K-750K with Cython (10-15x faster)**
- 🚀 **Optional Cython Backend** - Compile for **10-15x speedup** on big data workloads
- 🔌 **Framework Ready** - Native Pandas, Django, FastAPI & geospatial support
- 📊 **CSV Batch Processing** - CLI tool for processing thousands of addresses
- 🗺️ **Interactive Visualization** - Beautiful maps with Folium integration

---

## Installation

### Standard Installation (Pure Python)

```bash
pip install digipinpy
```

### High-Performance Installation (Cython - 10-15x faster)

For **production deployments** and **big data workloads**, install with Cython optimization:

```bash
# Requires a C compiler (see docs for platform-specific setup)
pip install cython
pip install digipinpy[performance]

# Build the optimized extension
cd /path/to/digipinpy
python setup.py build_ext --inplace
```

**Performance gain**: ~50K ops/sec → **~500K-750K ops/sec** (10-15x faster)

See the [Performance Optimization Guide](https://github.com/DEADSERPENT/digipin/blob/main/docs/performance-optimization.md) for detailed instructions.

### Optional Integrations

```bash
pip install digipinpy[pandas]    # Data science & CSV processing
pip install digipinpy[django]    # Django database field
pip install digipinpy[fastapi]   # FastAPI microservices
pip install digipinpy[geo]       # Geospatial polyfill
pip install digipinpy[viz]       # Interactive map visualization
pip install digipinpy[performance]  # Cython optimization (10-15x faster)
```

---

## Quick Start

### Basic Usage

```python
from digipin import encode, decode

# Encode coordinates to DIGIPIN
code = encode(28.622788, 77.213033)  # Dak Bhawan, New Delhi
print(code)  # '39J49LL8T4'

# Decode back to coordinates
lat, lon = decode('39J49LL8T4')
print(f"{lat:.6f}, {lon:.6f}")  # 28.622788, 77.213033
```

### Variable Precision

```python
# Encode with different precision levels
code_full = encode(28.622788, 77.213033, precision=10)  # ~3.8m
code_city = encode(28.622788, 77.213033, precision=5)   # ~1km
code_region = encode(28.622788, 77.213033, precision=3) # ~16km
```

### Proximity Search

```python
from digipin import get_neighbors, get_disk

# Get 8 immediate neighbors
neighbors = get_neighbors('39J49LL8T4')

# Get all cells within radius 3
search_area = get_disk('39J49LL8T4', radius=3)
```

### Polygon Coverage (NEW in v1.6.1)

```python
from digipin import polyfill

# Convert polygon to DIGIPIN codes
polygon = [(28.63, 77.22), (28.62, 77.21), (28.62, 77.23)]
codes = polyfill(polygon, precision=8)

# Choose algorithm (quadtree is default)
codes = polyfill(polygon, precision=8, algorithm="quadtree")  # Fast for sparse/large areas
codes = polyfill(polygon, precision=8, algorithm="grid")      # Fast for small dense zones
```

---

## ⚡ Performance

### Core Operations (Encoding/Decoding)

| Backend | Encoding | Decoding | Use Case |
|---------|----------|----------|----------|
| **Pure Python** | ~40K ops/sec | ~50K ops/sec | Development, small datasets |
| **Cython (C-compiled)** | **~400-600K ops/sec** | **~500-750K ops/sec** | Production, big data |

**Speedup: 10-15x faster with Cython backend** 🚀

```python
import digipin

# Check which backend is active
backend = digipin.get_backend_info()
print(backend)
# {'backend': 'cython', 'performance': '10-15x', ...}
```

**When to use Cython:**
- ✅ Processing 100K+ records
- ✅ Real-time systems (sub-millisecond latency)
- ✅ Production deployments with high throughput
- ✅ Nightly batch geocoding jobs

See [Performance Guide](https://github.com/DEADSERPENT/digipin/blob/main/docs/performance-optimization.md) for benchmarks and setup.

### Polyfill Algorithm Performance

**v1.6.1 introduces optimized quadtree algorithm** achieving **O(Perimeter)** complexity instead of O(Area):

| Use Case | Grid Scan | Quadtree | **Speedup** |
|----------|-----------|----------|-------------|
| **Sparse corridor (highway)** | 2.32s | 0.21s | **10.86x faster** ⚡ |
| Small delivery zones (< 10 km²) | 0.002s | 0.006s | 0.3x |
| Large areas (> 100 km²) | 0.86s | 1.00s | 0.95x |

**Key Findings:**
- ✅ Quadtree excels at **sparse polygons** (highways, rivers, corridors) - **up to 10x faster**
- ✅ Grid scan wins for **small dense areas** (typical delivery zones)
- ✅ **Both complete in < 50ms** for 80% of use cases
- ✅ Algorithm selection is automatic (configurable via `algorithm` parameter)

---

## Documentation

### 📚 User Guides
- [Getting Started](https://github.com/DEADSERPENT/digipin/blob/main/docs/getting-started.md) - Installation and first steps
- [API Reference](https://github.com/DEADSERPENT/digipin/blob/main/DOCUMENTATION.md) - Complete function reference
- [Use Cases](https://github.com/DEADSERPENT/digipin/blob/main/docs/use-cases.md) - Real-world examples

### 🔌 Integrations
- [Pandas Integration](https://github.com/DEADSERPENT/digipin/blob/main/docs/integrations-pandas.md) - DataFrame operations
- [Django Integration](https://github.com/DEADSERPENT/digipin/blob/main/docs/integrations-django.md) - Database field with validation
- [FastAPI Integration](https://github.com/DEADSERPENT/digipin/blob/main/docs/integrations-fastapi.md) - REST API microservices
- [Geospatial Polyfill](https://github.com/DEADSERPENT/digipin/blob/main/docs/geospatial-polyfill.md) - Polygon-to-codes conversion

### 🛠️ Development
- [Contributing Guide](CONTRIBUTING.md) - How to contribute
- [Build Guide](https://github.com/DEADSERPENT/digipin/blob/main/docs/BUILD_GUIDE.md) - Building from source
- [Performance Optimization](https://github.com/DEADSERPENT/digipin/blob/main/docs/performance-optimization.md) - Cython backend setup (10-15x faster)
- [Changelog](CHANGELOG.md) - Version history
- [Technical Specification](https://github.com/DEADSERPENT/digipin/blob/main/docs/technical_spec.md) - Official DIGIPIN spec

---

## Features at a Glance

| Feature | Description |
|---------|-------------|
| **Encoding/Decoding** | Coordinates ↔ DIGIPIN codes (50K ops/sec pure Python, **500K-750K with Cython**) |
| **Cython Backend** | Optional C-compiled backend for **10-15x speedup** |
| **Validation** | Check code validity with `is_valid()` |
| **Batch Operations** | Process arrays efficiently |
| **Proximity Search** | Find neighbors, rings, disks |
| **Hierarchical Ops** | Parent/child relationships |
| **CSV Batch Processing** | `digipin convert` CLI for CSV/Excel files |
| **Interactive Visualization** | `plot_pins()`, `plot_coverage()` with Folium |
| **Pandas Integration** | `.digipin` accessor for DataFrames |
| **Django Integration** | `DigipinField()` with auto-validation |
| **FastAPI Integration** | Pre-built REST API router |
| **Geospatial Polyfill** | Convert polygons to code sets |

---

## Project Status

- ✅ **Production Ready** - Version 1.6.1
- ✅ **100% Spec Compliant** - Official DoP specification
- ✅ **178 Tests Passing** - Comprehensive test coverage
- ✅ **Type Hints** - Full type annotation support
- ✅ **Multi-Platform** - Windows, macOS, Linux
- ✅ **Python 3.7-3.14** - Wide version support

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

**Quick setup:**

```bash
git clone https://github.com/DEADSERPENT/digipin.git
cd digipin/python
pip install -e ".[dev]"
pytest tests/ -v

# Optional: Build Cython extension for 10-15x speedup
pip install cython
python setup.py build_ext --inplace
python benchmarks/cython_performance.py  # Verify speedup
```

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Community & Support

**Maintained by:** SAMARTHA H V • MR SHIVAKUMAR
📧 samarthsmg14@gmail.com • hmrshivu@gmail.com

[📦 PyPI](https://pypi.org/project/digipinpy/) • [🐛 Issues](https://github.com/DEADSERPENT/digipin/issues) • [💬 Discussions](https://github.com/DEADSERPENT/digipin/discussions) • [📖 Changelog](CHANGELOG.md)

This implementation is based on the official DIGIPIN specification published by the **Department of Posts, Ministry of Communications, Government of India** (March 2025).

---

<div align="center">

**Government of India | Department of Posts | National Addressing Initiative**

</div>
