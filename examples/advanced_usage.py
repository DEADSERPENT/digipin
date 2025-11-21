"""
Advanced usage examples for digipin-py
"""

from digipin import (
    encode,
    decode,
    bounding_box,
    batch_encode,
    batch_decode,
    validate_with_details,
    get_precision_info,
)

# Example 1: Bounding Box
print("=" * 60)
print("Example 1: Bounding Box")
print("=" * 60)

code = "RG9GB8KLSF"
lat, lon = decode(code)
min_lat, max_lat, min_lon, max_lon = bounding_box(code)

print(f"DIGIPIN Code: {code}")
print(f"Center Point: ({lat:.6f}, {lon:.6f})")
print(f"Bounding Box:")
print(f"  Latitude:  {min_lat:.6f} to {max_lat:.6f}")
print(f"  Longitude: {min_lon:.6f} to {max_lon:.6f}")
print(f"  Width:  {(max_lon - min_lon) * 111000:.2f} meters")
print(f"  Height: {(max_lat - min_lat) * 111000:.2f} meters")
print()

# Example 2: Batch Operations
print("=" * 60)
print("Example 2: Batch Encoding and Decoding")
print("=" * 60)

coordinates = [
    (28.6139, 77.2090),  # New Delhi
    (19.0760, 72.8777),  # Mumbai
    (12.9716, 77.5946),  # Bengaluru
]

# Batch encode
codes = batch_encode(coordinates)
print("Batch Encoding:")
for (lat, lon), code in zip(coordinates, codes):
    print(f"  ({lat}, {lon}) → {code}")

print()

# Batch decode
decoded = batch_decode(codes)
print("Batch Decoding:")
for code, (lat, lon) in zip(codes, decoded):
    print(f"  {code} → ({lat:.4f}, {lon:.4f})")

print()

# Example 3: Detailed Validation
print("=" * 60)
print("Example 3: Detailed Validation")
print("=" * 60)

test_codes = [
    "RG9GB8KLSF",     # Valid
    "INVALID",        # Too short
    "RG9GB8KL@@",     # Invalid characters
    "RG9GB8KLXX",     # Wrong checksum
    "rg9gb8klsf",     # Lowercase (valid but warning)
]

for code in test_codes:
    result = validate_with_details(code)
    print(f"\nCode: {code}")
    print(f"Valid: {result['valid']}")
    if result['errors']:
        print(f"Errors: {', '.join(result['errors'])}")
    if result['warnings']:
        print(f"Warnings: {', '.join(result['warnings'])}")

print()

# Example 4: Different Precision Levels
print("=" * 60)
print("Example 4: Different Precision Levels")
print("=" * 60)

lat, lon = 28.6139, 77.2090

for k in [3, 4, 5]:
    code = encode(lat, lon, chars_per_axis=k)
    info = get_precision_info(k)

    print(f"\nPrecision Level k={k}:")
    print(f"  Code: {code}")
    print(f"  Length: {info['total_code_length']} characters")
    print(f"  Resolution: ~{info['lat_resolution_m']:.2f}m × {info['lon_resolution_m']:.2f}m")

print()

# Example 5: Privacy Mode (Lower Precision)
print("=" * 60)
print("Example 5: Privacy Mode (Approximate Location)")
print("=" * 60)

exact_lat, exact_lon = 28.6139, 77.2090

# High precision (exact location)
exact_code = encode(exact_lat, exact_lon, chars_per_axis=4)
exact_decoded = decode(exact_code, chars_per_axis=4)

# Low precision (approximate location)
approx_code = encode(exact_lat, exact_lon, chars_per_axis=3)
approx_decoded = decode(approx_code, chars_per_axis=3)

print(f"Exact Location (k=4):")
print(f"  Code: {exact_code}")
print(f"  Decoded: ({exact_decoded[0]:.6f}, {exact_decoded[1]:.6f})")
print(f"  Resolution: ~2 meters")

print(f"\nApproximate Location (k=3):")
print(f"  Code: {approx_code}")
print(f"  Decoded: ({approx_decoded[0]:.6f}, {approx_decoded[1]:.6f})")
print(f"  Resolution: ~70 meters")

print(f"\nDifference: {abs(exact_decoded[0] - approx_decoded[0]) * 111000:.1f}m")
