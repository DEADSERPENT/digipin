# Contributing to DIGIPIN-Py

First off, thank you for considering contributing to DIGIPIN-Py! This is an official implementation of the Government of India's national geocoding standard, and community contributions help make it better.

## Code of Conduct

This project adheres to the Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/DEADSERPENT/digipinpy/issues) to avoid duplicates.

When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, coordinates, DIGIPIN codes)
- **Describe the behavior you observed** and what you expected
- **Include your environment details** (Python version, OS, package version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the proposed functionality
- **Explain why this enhancement would be useful** to most users
- **List any alternative solutions** you've considered

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install development dependencies**:
   ```bash
   pip install -e ".[dev]"
   ```
3. **Make your changes** following the coding standards below
4. **Add tests** for any new functionality
5. **Ensure all tests pass**:
   ```bash
   pytest tests/ -v
   ```
6. **Format your code**:
   ```bash
   black src/digipin tests/
   flake8 src/digipin tests/
   ```
7. **Update documentation** if needed (README, DOCUMENTATION.md)
8. **Commit your changes** using clear, descriptive commit messages
9. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/digipinpy.git
cd digipinpy

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install in development mode with all dependencies
pip install -e ".[dev]"

# Run tests
pytest tests/ -v

# Run tests with coverage
pytest tests/ --cov=src/digipin --cov-report=html
```

## Coding Standards

### Style Guidelines

- Follow **PEP 8** style guide
- Use **Black** for code formatting (88 character line length)
- Use **type hints** for all function signatures
- Write **docstrings** for all public functions (Google style)

### Code Quality

- **No external dependencies** in the core library (zero-dependency principle)
- **Maintain 100% test coverage** for critical functions
- **Keep functions focused** and single-purpose
- **Use meaningful variable names**

### Example Code Style

```python
def encode(lat: float, lon: float, *, precision: int = 10) -> str:
    """
    Encode geographic coordinates to a DIGIPIN code.

    Args:
        lat: Latitude in decimal degrees (2.5°N to 38.5°N)
        lon: Longitude in decimal degrees (63.5°E to 99.5°E)
        precision: DIGIPIN code length (1-10), defaults to 10

    Returns:
        DIGIPIN code as a string

    Raises:
        ValueError: If coordinates are outside India's geographic bounds
        ValueError: If precision is not between 1 and 10

    Example:
        >>> encode(28.622788, 77.213033)
        '39J49LL8T4'
    """
    # Implementation...
```

## Testing

### Writing Tests

- Place tests in the `tests/` directory
- Name test files as `test_*.py`
- Use descriptive test function names: `test_encode_dak_bhawan()`
- Include edge cases and boundary conditions
- Test both success and failure cases

### Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_encoder.py -v

# Run with coverage
pytest tests/ --cov=src/digipin --cov-report=term

# Run with detailed output
pytest tests/ -vv --tb=short
```

## Specification Compliance

**CRITICAL**: This library implements an official government specification. Any changes to core encoding/decoding logic **must**:

1. Maintain 100% compliance with the official DIGIPIN specification
2. Include a reference to the specification section being implemented
3. Be validated against the official test cases
4. Not break backward compatibility

The official specification is located in `docs/technical_spec.md`.

## Documentation

- Update `README.md` for user-facing changes
- Update `DOCUMENTATION.md` for API changes
- Update `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/) format
- Use clear, concise language
- Provide code examples for new features

## Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests liberally

### Examples

```
Add proximity search functionality for DIGIPIN codes

Implements get_neighbors(), get_ring(), and get_disk() functions
to enable spatial queries around a given DIGIPIN code.

Closes #42
```

## Release Process

Releases are managed by the maintainers. The process:

1. Update version in `src/digipin/__init__.py` and `pyproject.toml`
2. Update `CHANGELOG.md` with release notes
3. Create a Git tag: `git tag -a v1.2.0 -m "Release v1.2.0"`
4. Push the tag: `git push origin v1.2.0`
5. GitHub Actions automatically publishes to PyPI

## Questions?

Feel free to:
- Open an issue for discussion
- Contact the maintainers: samarthsmg14@gmail.com, hmrshivu@gmail.com
- Check existing documentation in the `docs/` directory

## Recognition

Contributors will be recognized in:
- `CHANGELOG.md` release notes
- GitHub contributors page
- Special thanks in major release announcements

Thank you for helping make DIGIPIN-Py a world-class library! 🇮🇳
