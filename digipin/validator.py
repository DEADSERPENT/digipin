"""
DIGIPIN validation module.
Provides validation and verification functions for DIGIPIN codes.
"""

import re
from typing import Optional, Dict
from .utils import (
    base_decode,
    compute_checksum,
    DEFAULT_ALPHABET,
    LAT_MIN,
    LAT_MAX,
    LON_MIN,
    LON_MAX,
)


def is_valid(
    code: str,
    *,
    chars_per_axis: int = 4,
    base: int = 36,
    alphabet: str = DEFAULT_ALPHABET,
    checksum_length: int = 2
) -> bool:
    """
    Validate a DIGIPIN code.

    Checks:
    - Correct length
    - Valid characters (from alphabet)
    - Checksum correctness

    Args:
        code: DIGIPIN code string to validate
        chars_per_axis: Number of characters encoding each axis (default: 4)
        base: Base of the encoding system (default: 36)
        alphabet: Character set used for encoding (default: 0-9, A-Z)
        checksum_length: Length of checksum in characters (default: 2)

    Returns:
        True if code is valid, False otherwise

    Example:
        >>> is_valid('RG9GB8KLSF')
        True

        >>> is_valid('INVALID123')
        False

        >>> is_valid('RG9GB8KLXX')  # Wrong checksum
        False
    """
    try:
        # Check length
        expected_length = 2 * chars_per_axis + checksum_length
        if len(code) != expected_length:
            return False

        # Check characters
        code_upper = code.upper()
        for char in code_upper:
            if char not in alphabet:
                return False

        # Extract and decode parts
        lat_code = code_upper[0:chars_per_axis]
        lon_code = code_upper[chars_per_axis:2*chars_per_axis]
        checksum = code_upper[2*chars_per_axis:2*chars_per_axis+checksum_length]

        lat_index = base_decode(lat_code, alphabet)
        lon_index = base_decode(lon_code, alphabet)
        checksum_value = base_decode(checksum, alphabet)

        # Validate indices are in range
        n_steps = base ** chars_per_axis
        if not (0 <= lat_index < n_steps):
            return False
        if not (0 <= lon_index < n_steps):
            return False

        # Verify checksum
        expected_checksum = compute_checksum(lat_index, lon_index, base)
        if checksum_value != expected_checksum:
            return False

        return True

    except (ValueError, IndexError):
        return False


def validate_with_details(
    code: str,
    *,
    chars_per_axis: int = 4,
    base: int = 36,
    alphabet: str = DEFAULT_ALPHABET,
    checksum_length: int = 2
) -> Dict[str, any]:
    """
    Validate a DIGIPIN code and return detailed validation results.

    Args:
        code: DIGIPIN code string to validate
        chars_per_axis: Number of characters encoding each axis (default: 4)
        base: Base of the encoding system (default: 36)
        alphabet: Character set used for encoding (default: 0-9, A-Z)
        checksum_length: Length of checksum in characters (default: 2)

    Returns:
        Dictionary containing:
            - 'valid': bool - whether code is valid
            - 'errors': list of error messages (empty if valid)
            - 'warnings': list of warning messages

    Example:
        >>> validate_with_details('RG9GB8KLSF')
        {'valid': True, 'errors': [], 'warnings': []}

        >>> validate_with_details('INVALID')
        {
            'valid': False,
            'errors': ['Invalid code length. Expected 10, got 7'],
            'warnings': []
        }
    """
    errors = []
    warnings = []

    # Check length
    expected_length = 2 * chars_per_axis + checksum_length
    if len(code) != expected_length:
        errors.append(
            f"Invalid code length. Expected {expected_length}, got {len(code)}"
        )
        return {'valid': False, 'errors': errors, 'warnings': warnings}

    code_upper = code.upper()

    # Check if original code was lowercase (warning)
    if code != code_upper:
        warnings.append("Code contained lowercase characters (auto-converted)")

    # Check characters
    invalid_chars = [char for char in code_upper if char not in alphabet]
    if invalid_chars:
        errors.append(
            f"Invalid characters found: {', '.join(set(invalid_chars))}"
        )
        return {'valid': False, 'errors': errors, 'warnings': warnings}

    # Try to decode
    try:
        lat_code = code_upper[0:chars_per_axis]
        lon_code = code_upper[chars_per_axis:2*chars_per_axis]
        checksum = code_upper[2*chars_per_axis:2*chars_per_axis+checksum_length]

        lat_index = base_decode(lat_code, alphabet)
        lon_index = base_decode(lon_code, alphabet)
        checksum_value = base_decode(checksum, alphabet)

        # Validate indices
        n_steps = base ** chars_per_axis
        if not (0 <= lat_index < n_steps):
            errors.append(f"Latitude index {lat_index} out of valid range")

        if not (0 <= lon_index < n_steps):
            errors.append(f"Longitude index {lon_index} out of valid range")

        # Verify checksum
        expected_checksum = compute_checksum(lat_index, lon_index, base)
        if checksum_value != expected_checksum:
            errors.append("Checksum verification failed. Code may be corrupted.")

    except (ValueError, IndexError) as e:
        errors.append(f"Decoding error: {str(e)}")

    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'warnings': warnings
    }


def is_valid_coordinate(lat: float, lon: float) -> bool:
    """
    Check if coordinates are within India's bounding box.

    Args:
        lat: Latitude in degrees
        lon: Longitude in degrees

    Returns:
        True if coordinates are within bounds, False otherwise

    Example:
        >>> is_valid_coordinate(28.6139, 77.2090)
        True

        >>> is_valid_coordinate(0, 0)  # Outside India
        False
    """
    return (LAT_MIN <= lat <= LAT_MAX) and (LON_MIN <= lon <= LON_MAX)


def suggest_corrections(code: str, alphabet: str = DEFAULT_ALPHABET) -> list:
    """
    Suggest possible corrections for an invalid code.

    Useful for handling common typos like:
    - Mixed case
    - Similar looking characters (O vs 0, I vs 1, etc.)

    Args:
        code: Potentially invalid DIGIPIN code
        alphabet: Character set used for encoding

    Returns:
        List of suggested corrections (may be empty)

    Example:
        >>> suggest_corrections('rg9gb8klsf')  # lowercase
        ['RG9GB8KLSF']
    """
    suggestions = []

    # Try uppercase conversion
    upper = code.upper()
    if upper != code and is_valid(upper):
        suggestions.append(upper)

    # Common character substitutions
    substitutions = {
        'O': '0',
        '0': 'O',
        'I': '1',
        '1': 'I',
        'L': '1',
        'S': '5',
        '5': 'S',
        'Z': '2',
        '2': 'Z',
    }

    # Try single character substitutions
    for i, char in enumerate(code.upper()):
        if char in substitutions:
            corrected = code.upper()[:i] + substitutions[char] + code.upper()[i+1:]
            if corrected not in suggestions and is_valid(corrected):
                suggestions.append(corrected)

    return suggestions[:5]  # Return max 5 suggestions
