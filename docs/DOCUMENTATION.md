# digipinpy - Complete Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start Guide](#quick-start-guide)
4. [Core Concepts](#core-concepts)
5. [API Reference](#api-reference)
6. [Usage Examples](#usage-examples)
7. [Technical Specification](#technical-specification)
8. [Testing & Validation](#testing--validation)
9. [Performance](#performance)
10. [Frequently Asked Questions](#frequently-asked-questions)

---

## Introduction

### What is DIGIPIN?

DIGIPIN (Digital Postal Index Number) is India's official national-level addressing grid system developed by the Department of Posts in collaboration with IIT Hyderabad and NRSC, ISRO. It provides a standardized, geo-coded addressing framework for the entire country.

### What's New in v1.1.0

**Neighbor Discovery** - The most requested feature is now available!

Version 1.1.0 introduces powerful neighbor discovery capabilities that enable proximity-based queries and area expansion:

- **`get_neighbors()`** - Find immediately adjacent grid cells (all 8 directions or specific directions)
- **`get_disk()`** - Get all cells within a radius (perfect for "search nearby" features)
- **`get_ring()`** - Get cells at a specific distance (useful for progressive search)
- **Convenience aliases** - `get_surrounding_cells()` and `expand_search_area()`

These features unlock critical use cases:
- **Delivery routing**: "Find all delivery zones near this warehouse"
- **Emergency services**: "Which ambulances can reach this incident?"
- **Restaurant search**: "Show all restaurants within 100m"
- **Real estate**: "Find properties in this neighborhood"

See the [Neighbor Discovery API Reference](#neighbor-discovery-operations) and [Example 6](#example-6-neighbor-discovery--proximity-search-new-in-v110) for details.

### Key Features

- **Universal Coverage**: Covers entire India including maritime Exclusive Economic Zone (EEZ)
- **Hierarchical Precision**: 10 levels from regional (~1000 km) to precise (~3.8 m)
- **Neighbor Discovery**: Find adjacent cells and expand search areas (NEW in v1.1.0)
- **Offline Capability**: Works without internet connectivity
- **Directional Properties**: Logical naming pattern enables geographic queries
- **Privacy Respecting**: Represents locations only, stores no personal information
- **Government Standard**: Official specification by Ministry of Communications

### Use Cases

- **Delivery Services**: Precise address identification and proximity-based routing
- **Emergency Response**: Quick location identification and resource discovery
- **Proximity Search**: Find nearby restaurants, stores, or services
- **Banking & KYC**: Enhanced address verification
- **Agriculture**: Farm and land parcel identification
- **Real Estate**: Property location standardization and neighborhood search
- **Tourism**: Hotel and tourist spot addressing
- **Government Services**: Census, voting, welfare schemes
- **Maritime Operations**: Offshore asset identification (oil rigs, platforms)

---

## Installation

### Requirements

- Python 3.7 or higher
- No external dependencies required

### Install from PyPI

```bash
pip install digipinpy
```

### Install from Source

```bash
git clone https://github.com/DEADSERPENT/digipinpy.git
cd digipinpy
pip install -e .
```

### Development Installation

```bash
pip install digipinpy[dev]
```

Includes: pytest, pytest-cov, black, flake8, mypy

---

## Quick Start Guide

### Basic Encoding

```python
from digipin import encode

# Encode coordinates to DIGIPIN code
code = encode(28.622788, 77.213033)
print(code)  # Output: 39J49LL8T4
```

### Basic Decoding

```python
from digipin import decode

# Decode DIGIPIN code to coordinates
lat, lon = decode('39J49LL8T4')
print(f"Latitude: {lat:.6f}, Longitude: {lon:.6f}")
# Output: Latitude: 28.622788, Longitude: 77.213033
```

### Validation

```python
from digipin import is_valid

# Check if a DIGIPIN code is valid
print(is_valid('39J49LL8T4'))  # True
print(is_valid('INVALID123'))  # False
```

### Neighbor Discovery (NEW in v1.1.0)

```python
from digipin import encode, get_neighbors, get_disk

# Find nearby locations
my_location = encode(28.622788, 77.213033)

# Get all 8 immediate neighbors
neighbors = get_neighbors(my_location)
print(neighbors)  # ['39J49LL8T9', '39J49LL8TC', ...]

# Search within a radius
search_area = get_disk(my_location, radius=5)
print(f"Search area: {len(search_area)} cells")  # ~50 cells
```

---

## Core Concepts

### Hierarchical Grid System

DIGIPIN uses a 10-level hierarchical grid subdivision:

| Level | Code Length | Grid Size | Approx. Distance | Use Case |
|-------|-------------|-----------|------------------|----------|
| 1 | 1 char | 9° × 9° | ~1000 km | Regional |
| 2 | 2 chars | 2.25° × 2.25° | ~250 km | State |
| 3 | 3 chars | 33.75' × 33.75' | ~62 km | District |
| 4 | 4 chars | 8.44' × 8.44' | ~15 km | City |
| 5 | 5 chars | 2.11' × 2.11' | ~4 km | Locality |
| 6 | 6 chars | 0.53' × 0.53' | ~1 km | Neighborhood |
| 7 | 7 chars | 0.13' × 0.13' | ~250 m | Block |
| 8 | 8 chars | 0.03' × 0.03' | ~60 m | Building |
| 9 | 9 chars | 0.5" × 0.5" | ~15 m | Property |
| 10 | 10 chars | 0.12" × 0.12" | ~3.8 m | Precise location |

### Spiral Labeling Pattern

DIGIPIN uses an anticlockwise spiral pattern for labeling grid cells:

```
Grid Layout (4×4):
     Col 0   Col 1   Col 2   Col 3
   +-------+-------+-------+-------+
R0 |   F   |   C   |   9   |   8   |  (North)
   +-------+-------+-------+-------+
R1 |   J   |   3   |   2   |   7   |
   +-------+-------+-------+-------+
R2 |   K   |   4   |   5   |   6   |
   +-------+-------+-------+-------+
R3 |   L   |   M   |   P   |   T   |  (South)
   +-------+-------+-------+-------+
  (West)                       (East)
```

- Starts at center: `2`
- Spirals anticlockwise: `2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → C → F → J → K → L → M → P → T`
- Adjacent symbols are geographic neighbors

### Character Alphabet

16 unambiguous symbols:
- **Numbers (8)**: 2, 3, 4, 5, 6, 7, 8, 9
- **Letters (8)**: C, F, J, K, L, M, P, T

**Excluded for clarity**: 0, 1, O, I, G, W, X

### Bounding Box

**Official Coverage Area:**
- **Latitude**: 2.5°N to 38.5°N
- **Longitude**: 63.5°E to 99.5°E
- **Coordinate System**: EPSG:4326 (WGS84 datum, epoch 2005)

**Coverage includes:**
- All land territory of India
- Maritime Exclusive Economic Zone (EEZ)
- Island territories (Andaman & Nicobar, Lakshadweep)
- Offshore assets (oil rigs, platforms)

---

## API Reference

### Core Functions

#### `encode(lat, lon, *, precision=10)`

Encode geographic coordinates to a DIGIPIN code.

**Parameters:**
- `lat` (float): Latitude in degrees North (2.5° to 38.5°)
- `lon` (float): Longitude in degrees East (63.5° to 99.5°)
- `precision` (int, optional): Code length (1-10 characters). Default: 10

**Returns:**
- `str`: DIGIPIN code

**Raises:**
- `ValueError`: If coordinates are outside the bounding box

**Example:**
```python
code = encode(28.622788, 77.213033)  # '39J49LL8T4'
regional = encode(28.622788, 77.213033, precision=4)  # '39J4'
```

---

#### `decode(code)`

Decode a DIGIPIN code to geographic coordinates.

**Parameters:**
- `code` (str): DIGIPIN code (10 characters)

**Returns:**
- `Tuple[float, float]`: (latitude, longitude) of cell center

**Raises:**
- `ValueError`: If code format is invalid

**Example:**
```python
lat, lon = decode('39J49LL8T4')  # (28.622788, 77.213033)
```

---

#### `is_valid(code)`

Validate a DIGIPIN code format.

**Parameters:**
- `code` (str): DIGIPIN code to validate

**Returns:**
- `bool`: True if valid, False otherwise

**Example:**
```python
is_valid('39J49LL8T4')  # True
is_valid('INVALID123')  # False
```

---

### Batch Operations

#### `batch_encode(coordinates, **kwargs)`

Encode multiple coordinate pairs in batch.

**Parameters:**
- `coordinates` (list): List of (lat, lon) tuples
- `**kwargs`: Additional arguments for `encode()`

**Returns:**
- `list`: List of DIGIPIN codes

**Example:**
```python
coords = [
    (28.622788, 77.213033),  # Delhi
    (12.9716, 77.5946),      # Bengaluru
    (19.0760, 72.8777),      # Mumbai
]
codes = batch_encode(coords)
# ['39J49LL8T4', '4P3JK852C9', '4FK5958823']
```

---

#### `batch_decode(codes)`

Decode multiple DIGIPIN codes in batch.

**Parameters:**
- `codes` (list): List of DIGIPIN codes

**Returns:**
- `list`: List of (lat, lon) tuples

**Example:**
```python
codes = ['39J49LL8T4', '4P3JK852C9', '4FK5958823']
coords = batch_decode(codes)
# [(28.622788, 77.213033), (12.9716, 77.5946), (19.0760, 72.8777)]
```

---

### Hierarchical Operations

#### `get_parent(code, level)`

Get parent DIGIPIN code at a higher (coarser) level.

**Parameters:**
- `code` (str): Full DIGIPIN code
- `level` (int): Parent level (1 to len(code)-1)

**Returns:**
- `str`: Parent code (truncated)

**Example:**
```python
code = '39J49LL8T4'
get_parent(code, 1)  # '3' (regional)
get_parent(code, 4)  # '39J4' (city)
get_parent(code, 6)  # '39J49L' (neighborhood)
```

---

#### `is_within(child_code, parent_code)`

Check if a DIGIPIN code is within a larger region.

**Parameters:**
- `child_code` (str): Code to check
- `parent_code` (str): Parent region code

**Returns:**
- `bool`: True if child is within parent region

**Example:**
```python
is_within('39J49LL8T4', '39J49L')  # True (same neighborhood)
is_within('39J49LL8T4', '39')      # True (same state region)
is_within('39J49LL8T4', '48')      # False (different region)
```

---

#### `get_bounds(code)`

Get the bounding box of a grid cell.

**Parameters:**
- `code` (str): DIGIPIN code (1-10 characters)

**Returns:**
- `Tuple[float, float, float, float]`: (min_lat, max_lat, min_lon, max_lon)

**Example:**
```python
min_lat, max_lat, min_lon, max_lon = get_bounds('39J49LL8T4')
# Returns boundaries of the ~3.8m × 3.8m cell
```

---

#### `encode_with_bounds(lat, lon, **kwargs)`

Encode and return code with grid cell boundaries.

**Parameters:**
- `lat` (float): Latitude
- `lon` (float): Longitude
- `**kwargs`: Additional arguments for `encode()`

**Returns:**
- `dict`: Dictionary with 'code', 'lat', 'lon', and 'bounds' keys

**Example:**
```python
result = encode_with_bounds(28.622788, 77.213033)
# {
#     'code': '39J49LL8T4',
#     'lat': 28.622788,
#     'lon': 77.213033,
#     'bounds': (28.622785, 28.622791, 77.213029, 77.213036)
# }
```

---

#### `decode_with_bounds(code)`

Decode and return coordinates with grid cell boundaries.

**Parameters:**
- `code` (str): DIGIPIN code

**Returns:**
- `dict`: Dictionary with 'code', 'lat', 'lon', and 'bounds' keys

**Example:**
```python
result = decode_with_bounds('39J49LL8T4')
# {
#     'code': '39J49LL8T4',
#     'lat': 28.622788,
#     'lon': 77.213033,
#     'bounds': (28.622785, 28.622791, 77.213029, 77.213036)
# }
```

---

### Neighbor Discovery Operations

#### `get_neighbors(code, direction='all')`

Get immediate neighboring grid cells for a DIGIPIN code.

**Parameters:**
- `code` (str): The central DIGIPIN code (1-10 characters)
- `direction` (str, optional): Which neighbors to fetch
  - `'all'`: 8 neighbors (default)
  - `'cardinal'`: 4 neighbors (N, S, E, W)
  - Specific: `'north'`, `'south'`, `'east'`, `'west'`, `'northeast'`, `'northwest'`, `'southeast'`, `'southwest'`

**Returns:**
- `List[str]`: Valid DIGIPIN codes for the neighbors

**Raises:**
- `ValueError`: If code is invalid or direction is not recognized

**Example:**
```python
# Get all 8 surrounding cells
neighbors = get_neighbors('39J49LL8T4')
# ['39J49LL8T9', '39J49LL8TC', '39J49LL8T5', ...]

# Get only cardinal directions
cardinal = get_neighbors('39J49LL8T4', direction='cardinal')
# ['39J49LL8T9', '39J49LL8T3', '39J49LL8T5', '39J49LL8TF']

# Get specific direction
north = get_neighbors('39J49LL8T4', direction='north')
# ['39J49LL8T9']
```

---

#### `get_ring(code, radius)`

Get all grid cells at exactly 'radius' distance from center (hollow ring).

**Parameters:**
- `code` (str): Center DIGIPIN code
- `radius` (int): Distance in cells (must be >= 1)

**Returns:**
- `List[str]`: Unique codes forming the ring at specified radius

**Raises:**
- `ValueError`: If radius < 1 or code is invalid

**Example:**
```python
# Get cells exactly 1 step away (8 immediate neighbors)
ring1 = get_ring('39J49LL8T4', radius=1)  # 8 neighbors

# Get cells exactly 2 steps away
ring2 = get_ring('39J49LL8T4', radius=2)  # Up to 16 cells
```

---

#### `get_disk(code, radius=1)`

Get all grid cells within a specific cell radius (filled disk).

**Parameters:**
- `code` (str): Center DIGIPIN code
- `radius` (int): Number of cell layers to expand (must be >= 0)
  - `0`: Just the center cell
  - `1`: 3×3 grid (center + 8 neighbors)
  - `2`: 5×5 grid (25 cells total)
  - `n`: (2n+1)×(2n+1) grid

**Returns:**
- `List[str]`: Unique codes covering the disk area, including center

**Raises:**
- `ValueError`: If radius < 0 or code is invalid

**Example:**
```python
# Center + 8 immediate neighbors (3×3 grid)
disk1 = get_disk('39J49LL8T4', radius=1)  # 9 cells

# 5×5 grid for wider search area
disk2 = get_disk('39J49LL8T4', radius=2)  # 25 cells

# Delivery search: Find warehouses within ~40m
# (Level 10 cells are ~3.8m, so radius=10 ≈ 38m)
customer_code = encode(lat, lon)
search_area = get_disk(customer_code, radius=10)
nearby_warehouses = db.query(Warehouse).filter(
    Warehouse.digipin.in_(search_area)
)
```

---

#### `get_surrounding_cells(code)`

Alias for `get_neighbors(code, direction='all')`. Returns all 8 immediate neighbors.

**Example:**
```python
neighbors = get_surrounding_cells('39J49LL8T4')  # 8 neighbors
```

---

#### `expand_search_area(code, radius=1)`

Alias for `get_disk(code, radius)`. Returns all cells within radius distance (including center).

**Example:**
```python
search_area = expand_search_area('39J49LL8T4', radius=5)
```

---

### Utility Functions

#### `is_valid_coordinate(lat, lon)`

Check if coordinates are within India's bounding box.

**Parameters:**
- `lat` (float): Latitude
- `lon` (float): Longitude

**Returns:**
- `bool`: True if within bounds

**Example:**
```python
is_valid_coordinate(28.622788, 77.213033)  # True
is_valid_coordinate(0, 0)                   # False
```

---

#### `get_precision_info(level=10)`

Get detailed precision information for a level.

**Parameters:**
- `level` (int): DIGIPIN level (1-10)

**Returns:**
- `dict`: Precision details

**Example:**
```python
info = get_precision_info(10)
# {
#     'level': 10,
#     'code_length': 10,
#     'grid_size_lat_deg': 3.38e-05,
#     'grid_size_lon_deg': 3.38e-05,
#     'approx_distance_m': 3.814,
#     'total_cells': 1099511627776,
#     'description': 'Precise location (~3.8 m)'
# }
```

---

#### `get_grid_size(level)`

Calculate grid cell size at a given level.

**Parameters:**
- `level` (int): DIGIPIN level (1-10)

**Returns:**
- `Tuple[float, float]`: (lat_degrees, lon_degrees) cell size

**Example:**
```python
lat_size, lon_size = get_grid_size(10)  # (3.38e-05, 3.38e-05)
```
---

#### `get_approx_distance(level)`

Get approximate linear distance for grid cell at a level.

**Parameters:**
- `level` (int): DIGIPIN level (1-10)

**Returns:**
- `float`: Approximate cell size in meters

**Example:**
```python
distance = get_approx_distance(10)  # 3.814 meters
```
---

### Constants and Imports

```python
# Core functions
from digipin import encode, decode, is_valid

# Batch operations
from digipin import batch_encode, batch_decode

# Hierarchical operations
from digipin import get_bounds, get_parent, is_within
from digipin import encode_with_bounds, decode_with_bounds

# Neighbor discovery (NEW in v1.1.0)
from digipin import get_neighbors, get_ring, get_disk
from digipin import get_surrounding_cells, expand_search_area

# Utilities
from digipin import is_valid_coordinate, get_precision_info
from digipin import get_grid_size, get_approx_distance

# Constants
from digipin import (
    LAT_MIN,          # 2.5 (minimum latitude)
    LAT_MAX,          # 38.5 (maximum latitude)
    LON_MIN,          # 63.5 (minimum longitude)
    LON_MAX,          # 99.5 (maximum longitude)
    DIGIPIN_ALPHABET, # '23456789CFJKLMPT' (16 symbols)
    DIGIPIN_LEVELS    # 10 (number of hierarchical levels)
)
```
---

## Usage Examples

### Example 1: Delivery Application

```python
from digipin import encode, decode, get_bounds

# Customer places order
customer_lat, customer_lon = 28.622788, 77.213033

# Generate DIGIPIN for delivery address
delivery_code = encode(customer_lat, customer_lon)
print(f"Delivery DIGIPIN: {delivery_code}")  # 39J49LL8T4

# Delivery agent uses code to navigate
target_lat, target_lon = decode(delivery_code)
print(f"Target location: {target_lat}, {target_lon}")

# Get precise delivery area boundaries
min_lat, max_lat, min_lon, max_lon = get_bounds(delivery_code)
print(f"Delivery zone: {min_lat} to {max_lat}, {min_lon} to {max_lon}")
```

### Example 2: Emergency Services

```python
from digipin import encode, is_within

# Emergency call with location
emergency_lat, emergency_lon = 12.9716, 77.5946
emergency_code = encode(emergency_lat, emergency_lon)

# Dispatch to nearest station in same district (level 3)
district_code = emergency_code[:3]  # '4P3'

# Check if ambulance location is in same district
ambulance_code = '4P3JK9XXXX'
if is_within(ambulance_code, district_code):
    print("Ambulance is in same district - dispatching")
else:
    print("Need to dispatch from different district")
```

### Example 3: Real Estate Listings

```python
from digipin import encode, get_parent

# Property location
property_lat, property_lon = 19.0760, 72.8777
property_code = encode(property_lat, property_lon)

# Create hierarchical listing
print(f"Precise location: {property_code}")              # 4FK5958823
print(f"Building: {get_parent(property_code, 8)}")       # 4FK59588
print(f"Block: {get_parent(property_code, 7)}")          # 4FK5958
print(f"Neighborhood: {get_parent(property_code, 6)}")   # 4FK595
print(f"Locality: {get_parent(property_code, 5)}")       # 4FK59
```

### Example 4: Agricultural Land Mapping

```python
from digipin import batch_encode, get_bounds

# Farm plot corners
corners = [
    (26.9124, 75.7873),  # Northwest
    (26.9124, 75.7883),  # Northeast
    (26.9114, 75.7883),  # Southeast
    (26.9114, 75.7873),  # Southwest
]

# Generate DIGIPIN codes for corners
plot_codes = batch_encode(corners)
print("Farm plot DIGIPIN codes:")
for i, code in enumerate(plot_codes):
    print(f"  Corner {i+1}: {code}")

# Calculate plot area using bounds
min_lat1, max_lat1, min_lon1, max_lon1 = get_bounds(plot_codes[0])
min_lat2, max_lat2, min_lon2, max_lon2 = get_bounds(plot_codes[2])

# Approximate area calculation (simplified)
lat_diff = abs(max_lat1 - min_lat2) * 111000  # meters
lon_diff = abs(max_lon2 - min_lon1) * 111000  # meters
area_sqm = lat_diff * lon_diff
print(f"Approximate plot area: {area_sqm:.2f} sq meters")
```

### Example 5: Tourism & Navigation

```python
from digipin import encode, decode, batch_decode

# Tourist spots
spots = {
    'India Gate': '39J5XXXXXX',
    'Red Fort': '39J6XXXXXX',
    'Qutub Minar': '39JXXXXXXX'
}

# Plan route by decoding all locations
for name, code in spots.items():
    lat, lon = decode(code)
    print(f"{name}: {lat:.6f}, {lon:.6f}")

# Batch decode for route optimization
codes = list(spots.values())
coordinates = batch_decode(codes)
print(f"Route coordinates: {coordinates}")
```

### Example 6: Neighbor Discovery & Proximity Search (NEW in v1.1.0)

```python
from digipin import encode, get_neighbors, get_disk, get_ring

# Find nearby locations
my_location = encode(28.622788, 77.213033)

# Get all 8 immediate neighbors
neighbors = get_neighbors(my_location)
print(f"Immediate neighbors: {len(neighbors)} cells")
# ['39J49LL8T9', '39J49LL8TC', '39J49LL8T5', ...]

# Get only cardinal directions (N, S, E, W)
cardinal = get_neighbors(my_location, direction='cardinal')
print(f"Cardinal neighbors: {len(cardinal)} cells")

# Get specific direction
north = get_neighbors(my_location, direction='north')
print(f"North neighbor: {north[0]}")

# Delivery zone expansion
warehouse_code = encode(28.6, 77.2, precision=8)
delivery_zone = get_disk(warehouse_code, radius=3)
print(f"Delivery zone: {len(delivery_zone)} cells (~180m radius)")

# Database query for nearby restaurants
customer_code = encode(lat, lon)
search_area = get_disk(customer_code, radius=10)  # ~40m radius
nearby_restaurants = db.query(Restaurant).filter(
    Restaurant.digipin.in_(search_area)
)

# Emergency response tiers
incident_code = encode(12.9716, 77.5946, precision=8)
tier1 = get_neighbors(incident_code)              # Immediate
tier2 = get_disk(incident_code, radius=5)         # 300m radius
tier3 = get_disk(incident_code, radius=10)        # 600m radius

# Progressive ring expansion
search_center = encode(28.5, 77.0, precision=7)
for radius in [1, 2, 3, 4, 5]:
    ring = get_ring(search_center, radius=radius)
    print(f"Ring {radius}: {len(ring)} cells (~{radius*250}m)")
```

---

## Technical Specification

### Algorithm Details

#### Encoding Algorithm

1. **Validate Coordinates**: Check if within bounding box (2.5-38.5°N, 63.5-99.5°E)
2. **Initialize Bounds**: Start with full India bounding box
3. **Hierarchical Subdivision** (repeat 10 times):
   - Divide current region into 4×4 grid
   - Calculate which sub-grid contains the point
   - Map grid position to symbol using spiral pattern
   - Append symbol to code
   - Narrow bounds to selected sub-grid
4. **Return Code**: 10-character string

#### Decoding Algorithm

1. **Validate Code**: Check format (10 chars, valid alphabet)
2. **Initialize Bounds**: Start with full India bounding box
3. **Hierarchical Lookup** (for each character):
   - Map character to grid position using spiral pattern
   - Divide current region into 4×4 grid
   - Select sub-grid at position
   - Update bounds to sub-grid
4. **Return Center**: Center point of final grid cell

#### Boundary Assignment Rules

For coordinates coinciding with grid lines:
- **Vertical lines (N-S)**: Assign to eastern (right) cell
- **Horizontal lines (E-W)**: Assign to northern (upper) cell
- **Intersections**: Assign to northeastern (top-right) cell
- **Exceptions**: Top-most (38.5°N) and right-most (99.5°E) boundaries assign to opposite side

#### Neighbor Discovery Algorithm (NEW in v1.1.0)

The neighbor discovery algorithm uses a robust coordinate-based approach:

1. **Decode Center**: Convert DIGIPIN code to lat/lon coordinates
2. **Calculate Grid Size**: Determine cell dimensions at current level
3. **Compute Offsets**: Calculate neighbor coordinates by adding/subtracting grid size
4. **Re-encode**: Convert neighbor coordinates back to DIGIPIN codes
5. **Validate**: Filter out codes that fall outside India's bounding box

This approach automatically handles:
- **Boundary Crossing**: When neighbors span different parent grids
- **Edge Cases**: Cells near India's geographic boundaries
- **Variable Precision**: Works consistently across all 10 hierarchical levels

**Performance Characteristics**:
- `get_neighbors()`: O(8) - constant time for 8 neighbors
- `get_ring(radius)`: O(8R) - linear in radius
- `get_disk(radius)`: O(R²) - quadratic in radius
- Typical execution: ~200μs for immediate neighbors

### Coordinate Reference System

- **Standard**: EPSG:4326
- **Datum**: WGS84 at epoch 2005
- **Units**: Decimal degrees
- **Precision**: Double-precision floating-point

### Grid Properties

- **Subdivision Factor**: 4×4 at each level
- **Total Levels**: 10
- **Total Cells at Level 10**: 4^10 × 4^10 = 1,099,511,627,776 cells
- **Cell Dimensions** (at equator):
  - Level 10: ~3.8m × 3.8m
  - Level 9: ~15m × 15m
  - Level 8: ~60m × 60m
  - Level 6: ~1km × 1km
  - Level 1: ~1000km × 1000km

---

## Testing & Validation

### Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=digipin --cov-report=html

# Run specific test
pytest tests/test_official_spec.py::TestOfficialSpecification::test_dak_bhawan_official_example -v
```

### Test Coverage

**Comprehensive test suite covering:**

1. **Official Specification Compliance**
   - Dak Bhawan official example (28.622788°N, 77.213033°E → `39J49LL8T4`)
   - Major cities across India
   - Round-trip encoding/decoding accuracy

2. **Boundary Conditions**
   - Bounding box corners
   - Edge cases at grid lines
   - Center of India

3. **Validation**
   - Coordinate validation
   - Code format validation
   - Character alphabet verification

4. **Hierarchical Operations**
   - Parent code extraction
   - Containment checking
   - Multi-level operations

5. **Grid System**
   - Spiral pattern verification
   - Position-symbol mapping
   - Grid size calculations

6. **Neighbor Discovery** (NEW in v1.1.0)
   - Immediate neighbor detection
   - Cardinal vs. all directions
   - Ring and disk expansion
   - Boundary edge cases
   - Multi-level neighbor queries

7. **Constants & Configuration**
   - Alphabet composition
   - Bounding box dimensions
   - Level configuration

### Validation Results

- **Test Success Rate**: 100% (all tests passing)
- **Official Example**: ✓ PASS
- **Round-trip Accuracy**: < 5m error
- **Edge Cases**: ✓ ALL PASS
- **Neighbor Discovery**: ✓ ALL PASS (NEW)
- **Specification Compliance**: 100%

---

## Performance

### Benchmarks

Tested on: Intel i5, Python 3.10

| Operation | Time (avg) | Throughput |
|-----------|------------|------------|
| Single encode | ~25 μs | ~40,000 ops/sec |
| Single decode | ~20 μs | ~50,000 ops/sec |
| Batch encode (100) | ~2.5 ms | ~40,000 ops/sec |
| Batch decode (100) | ~2.0 ms | ~50,000 ops/sec |
| Validation | ~5 μs | ~200,000 ops/sec |
| **Neighbor discovery** (NEW) | ~200 μs | ~5,000 ops/sec |
| **get_disk(radius=1)** | ~300 μs | ~3,300 ops/sec |
| **get_disk(radius=10)** | ~4 ms | ~250 ops/sec |
| **get_ring(radius=5)** | ~1.5 ms | ~670 ops/sec |

### Memory Usage

- **Library size**: < 50 KB
- **Runtime memory**: < 1 MB
- **Zero dependencies**: No external packages required

### Optimization Tips

1. **Batch Operations**: Use `batch_encode()` / `batch_decode()` for multiple locations
2. **Precision Control**: Use lower precision (level 6-8) when exact precision not needed
3. **Caching**: Cache frequently used codes in your application
4. **Validation**: Pre-validate coordinates before encoding to avoid exceptions

---

## Frequently Asked Questions

### General Questions

**Q: What is the difference between DIGIPIN and PIN code?**
A: PIN code (Postal Index Number) identifies a postal delivery area. DIGIPIN is a geographic grid code that identifies a precise ~3.8m location anywhere in India.

**Q: Does DIGIPIN replace traditional addresses?**
A: No, DIGIPIN complements traditional addresses by providing an additional geographic attribute.

**Q: Can I use DIGIPIN for navigation?**
A: Yes, DIGIPIN codes can be converted to lat/lon coordinates for navigation apps.

**Q: Is DIGIPIN unique for each location?**
A: Yes, each ~3.8m × 3.8m grid cell has a unique 10-character code.

### Technical Questions

**Q: What coordinate system should I use?**
A: Use EPSG:4326 (WGS84). If your coordinates are in a different system, convert them first.

**Q: Why does my decoded coordinate differ slightly from encoded?**
A: Decoding returns the center of the grid cell. Maximum deviation is ~2.7m (half diagonal of 3.8m cell).

**Q: Can I use partial codes?**
A: Yes, shorter codes represent larger areas. Use `precision` parameter when encoding.

**Q: How do I handle coordinates outside India?**
A: The library will raise a `ValueError`. DIGIPIN only covers India's bounding box.

**Q: Is the library thread-safe?**
A: Yes, all functions are pure and stateless, safe for concurrent use.

**Q: How do I find all locations within a certain distance?** (NEW)
A: Use `get_disk()` to get all cells within a radius. For example, `get_disk(code, radius=10)` returns all cells within ~10 grid cells. Calculate the radius based on your precision level (e.g., Level 10 cells are ~3.8m, so radius=10 ≈ 38m).

**Q: What's the difference between get_ring() and get_disk()?** (NEW)
A: `get_ring(code, radius)` returns only cells at exactly the specified distance (hollow ring), while `get_disk(code, radius)` returns all cells within and including that distance (filled disk). Use `get_disk()` for "nearby" searches and `get_ring()` for progressive expansion.

### Integration Questions

**Q: How do I integrate with Django/Flask?**
A: Import and use functions directly in your views/routes. No special integration needed.

**Q: Can I use this with GPS devices?**
A: Yes, convert GPS coordinates (lat/lon) to DIGIPIN using `encode()`.

**Q: How do I store DIGIPIN codes in database?**
A: Store as `VARCHAR(10)` or `CHAR(10)`. Consider indexing for fast lookups.

**Q: Can I display DIGIPIN on maps?**
A: Yes, decode to coordinates and use any mapping library (Folium, Plotly, Google Maps).

---

## Package Structure

```
digipinpy/
├── digipin/
│   ├── __init__.py         # Public API exports
│   ├── encoder.py          # Coordinate → DIGIPIN encoding
│   ├── decoder.py          # DIGIPIN → Coordinate decoding
│   ├── neighbors.py        # Neighbor discovery (NEW in v1.1.0)
│   ├── utils.py            # Constants, validation, utilities
│   └── cli.py              # Command-line interface
├── tests/
│   ├── __init__.py
│   ├── test_official_spec.py  # Comprehensive test suite
│   └── test_neighbors.py   # Neighbor discovery tests (NEW)
├── examples/
│   ├── basic_usage.py      # Basic examples
│   ├── advanced_usage.py   # Advanced examples
│   ├── delivery_app.py     # Real-world application
│   └── neighbor_discovery.py  # Neighbor discovery examples (NEW)
├── images/                  # Official specification diagrams
├── DOCUMENTATION.md         # This file
├── README.md               # Quick start guide
├── LICENSE                 # MIT License
├── pyproject.toml          # Package configuration
└── DIGIPIN_Technical_Document.md  # Official specification

```

---

## Support & Contributing

### Getting Help

- **GitHub Issues**: https://github.com/DEADSERPENT/digipinpy/issues
- **Email**: samarthsmg14@gmail.com

### Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`pytest tests/ -v`)
6. Submit a pull request

### Code Style

- Follow PEP 8 guidelines
- Use Black for formatting (`black .`)
- Add type hints where appropriate
- Document all public functions

---

## License

MIT License

Copyright (c) 2025 SAMARTHA H V

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

## References

1. Department of Posts, Ministry of Communications, Government of India. "Digital Postal Index Number (DIGIPIN) - Technical Document, Final Version." March 2025.

2. National Geospatial Policy 2022, Department of Science & Technology, Government of India.

3. EPSG:4326 - WGS 84 Coordinate Reference System. https://epsg.io/4326

---

**Last Updated**: January 2025
**Version**: 1.1.0
**Maintained by**: SAMARTHA H V & MR SHIVAKUMAR
