# Changelog

All notable changes to this project will be documented in this file.

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
