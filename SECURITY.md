# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The DIGIPIN-Py team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

- **Primary Contact**: samarthsmg14@gmail.com
- **Secondary Contact**: hmrshivu@gmail.com

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### What to Expect

- **Acknowledgment**: We'll acknowledge receipt of your vulnerability report within 48 hours
- **Updates**: We'll send you updates about our progress every 5-7 days
- **Disclosure**: We'll work with you to determine an appropriate disclosure timeline
- **Credit**: We'll credit you in the release notes unless you prefer to remain anonymous

### Our Commitment

- We will respond to your report promptly
- We will keep you informed of our progress towards a fix
- We will handle your report with strict confidentiality
- We will credit you for your discovery (unless you prefer anonymity)

## Security Best Practices for Users

### Input Validation

Always validate user input before encoding:

```python
from digipin import encode, is_valid_coordinate

def safe_encode(lat, lon):
    if not is_valid_coordinate(lat, lon):
        raise ValueError("Invalid coordinates")
    return encode(lat, lon)
```

### Data Sanitization

When displaying DIGIPIN codes in web applications, ensure proper escaping:

```python
import html

def display_code(code):
    return html.escape(code)
```

### Dependency Management

While DIGIPIN-Py has zero runtime dependencies, keep development dependencies updated:

```bash
pip install --upgrade pip setuptools wheel
pip install -e ".[dev]" --upgrade
```

## Known Security Considerations

### Coordinate Privacy

- DIGIPIN codes can be decoded back to approximate coordinates
- Consider the privacy implications before sharing location codes
- Use appropriate precision levels for your use case

### Input Bounds

- The library validates input coordinates against India's geographic bounds
- Invalid inputs raise `ValueError` - handle these appropriately in your application

### Rate Limiting

- Consider implementing rate limiting if exposing DIGIPIN encoding/decoding via API
- Batch operations can be memory-intensive for very large datasets

## Acknowledgments

We thank the following security researchers for their responsible disclosure:

- *None yet - be the first!*

## Contact

For any security concerns, contact:
- samarthsmg14@gmail.com
- hmrshivu@gmail.com

---

This security policy is based on best practices from the [security.txt](https://securitytxt.org/) standard.
