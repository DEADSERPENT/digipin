# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-01-28

### Added - MAJOR FEATURE: Neighbor Discovery

This release adds **neighbor discovery** capabilities, a critical feature for proximity-based applications that was missing from the initial release. This unlocks use cases in delivery routing, emergency response, and location-based services.

#### New Functions

- **`get_neighbors(code, direction='all')`** - Get immediately adjacent grid cells
  - Supports 8-directional queries ('all', 'cardinal', or specific directions)
  - Handles boundary crossing between parent grids automatically
  - Returns variable-length lists (fewer neighbors at bounding box edges)

- **`get_ring(code, radius)`** - Get hollow ring of cells at exact distance
  - Perfect for progressive area expansion
  - Uses Chebyshev distance (chessboard metric)

- **`get_disk(code, radius)`** - Get filled disk of all cells within radius
  - The primary function for "search nearby" queries
  - Returns (2radius+1)² cells (e.g., radius=1 → 3×3 grid)
  - Essential for delivery zones, emergency coverage, restaurant search

- **Convenience aliases**:
  - `get_surrounding_cells(code)` - alias for get_neighbors(direction='all')
  - `expand_search_area(code, radius)` - alias for get_disk()

#### New Examples

- **examples/neighbor_discovery.py** - Comprehensive examples including:
  - Basic neighbor discovery (8 directions)
  - Delivery zone expansion from warehouse
  - Emergency response tier system
  - Restaurant "find nearby" search
  - Progressive ring expansion for real estate
  - Multi-level hierarchical search
  - Performance benchmarks

#### API Enhancements

- **Enhanced `is_valid_digipin()`** - Now supports variable-length codes (1-10 chars)
  - New parameter: `strict=False` (set True to require exactly 10 chars)
  - Enables validation of partial-precision codes (e.g., "39J4" for city-level)

- **Enhanced `validate_digipin()`** - Now supports variable-length codes
  - Accepts codes of any precision level (1-10 characters)
  - Maintains backward compatibility (default behavior unchanged)

### Testing

- **28 new comprehensive tests** in tests/test_neighbors.py:
  - Basic neighbor discovery (8 directions, cardinal, specific)
  - Boundary crossing between parent grids
  - Edge cases at bounding box limits
  - Ring and disk calculations
  - Real-world use case simulations
  - Performance characteristics
  - Specification compliance

- **All 59 tests passing** (31 original + 28 new)
- **Test coverage**: 100% for neighbor discovery module

### Performance

- Neighbor discovery: ~0.15ms per query
- Disk expansion (radius=10): ~3-4ms
- Suitable for real-time applications

### Use Cases Unlocked

This release enables:
- **Delivery routing**: "Find warehouses within 200m of this address"
- **Emergency response**: "Which ambulances can reach this incident in 5 minutes?"
- **Restaurant search**: "Show restaurants within 100m"
- **Real estate**: "Find properties in this neighborhood"
- **Proximity queries**: Any "what's nearby" functionality

### Documentation

- Detailed docstrings for all new functions
- 8 comprehensive examples with real-world scenarios
- Performance benchmarks included
- Vision expansion document outlining future roadmap

### Notes

- **Breaking changes**: None - fully backward compatible
- **Dependencies**: Still zero external dependencies
- **Python support**: 3.7-3.13 (unchanged)

## [1.0.1] - 2025-11-26

### Fixed

#### Documentation
- Fixed typo in `DIGIPIN_Technical_Document.md` header (removed accidental CLI command)

#### Examples
- **examples/advanced_usage.py**
  - Fixed import: Changed `bounding_box` → `get_bounds`
  - Fixed import: Removed non-existent `validate_with_details` → replaced with `is_valid`
  - Fixed parameter: Changed `chars_per_axis` → `precision` throughout
  - Fixed field names: Changed `info['total_code_length']` → `info['code_length']`
  - Fixed field names: Changed `info['lat_resolution_m']` → `info['approx_distance_m']`
  - Fixed invalid DIGIPIN code: Changed "RG9GB8KLSF" → "39J49LL8T4"
  - Rewrote Example 3 to use actual API functions
  - Rewrote Example 5 to work with API constraints (decoder requires full 10-char codes)
  - Added Windows console encoding fix for unicode characters

- **examples/delivery_app.py**
  - Fixed import: Changed `bounding_box` → `get_bounds`
  - Fixed function call: Updated `bounding_box(self.code)` → `get_bounds(self.code)`
  - Fixed invalid DIGIPIN code: Changed "RG9GB8KLSF" → "39J49LL8T4"
  - Added Windows console encoding fix for unicode emojis

- **examples/basic_usage.py**
  - No changes needed (was already correct)

#### CLI Enhancements
- **digipin/cli.py**
  - Added `--format json` option to `encode` command
  - Added `--format json` option to `validate` command
  - Added Windows console encoding fix for unicode characters (✓, ✗, etc.)
  - JSON output now works seamlessly with `jq` and shell scripts

### Testing
- All 31 unit tests passing ✓
- All 3 example files running correctly ✓
- All CLI commands tested and working ✓
- API functions verified and operational ✓
- Edge cases and boundary conditions tested ✓

### Notes
- Examples now accurately reflect the actual API
- Better cross-platform compatibility (Windows, Linux, macOS)
- Enhanced CLI usability for automation workflows

## [1.0.0] - 2025-11-25

### Added
- Initial release
- Core encoding/decoding functionality
- Batch operations
- Hierarchical operations
- CLI interface
- Comprehensive test suite (31 tests)
- Full documentation
- Example files
