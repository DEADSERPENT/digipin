"""
Setup script for digipinpy with optional Cython acceleration.

This setup.py enables building Cython extensions for 10-15x performance improvement.
Falls back gracefully to pure Python if Cython is not available.

Building with Cython:
    pip install cython  # Install Cython first
    python setup.py build_ext --inplace  # Compile extensions
    pip install -e .  # Install in development mode

Building binary wheels:
    pip install cython wheel
    python setup.py bdist_wheel  # Creates platform-specific wheel
"""

import sys
from pathlib import Path
from setuptools import setup, Extension

# Determine if Cython is available
try:
    from Cython.Build import cythonize
    USE_CYTHON = True
    print("✓ Cython found - building optimized extensions")
except ImportError:
    USE_CYTHON = False
    print("⚠ Cython not found - skipping performance extensions")
    print("  Install Cython for 10-15x speedup: pip install cython")

# Configure Cython extension
extensions = []

if USE_CYTHON:
    # Cython extension configuration
    ext_module = Extension(
        name="digipin.core_fast",
        sources=["src/digipin/core_fast.pyx"],
        language="c",
        # Compiler optimization flags
        extra_compile_args=[
            "-O3",  # Maximum optimization
            "-march=native",  # CPU-specific optimizations (optional)
        ] if sys.platform != "win32" else [
            "/O2",  # MSVC optimization for Windows
        ],
    )

    # Cythonize with compiler directives
    extensions = cythonize(
        [ext_module],
        compiler_directives={
            "language_level": "3",  # Python 3 syntax
            "boundscheck": False,  # Disable bounds checking for speed
            "wraparound": False,  # Disable negative indexing
            "cdivision": True,  # Use C division (faster)
            "embedsignature": True,  # Embed function signatures for help()
        },
        # Annotate HTML for performance analysis (optional)
        annotate=False,
    )

# Call setup with extensions (if available)
setup(
    ext_modules=extensions,
    # All other metadata read from pyproject.toml
)
