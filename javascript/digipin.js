/**
 * DIGIPIN-JS
 * Official JavaScript implementation of India's national geocoding standard
 *
 * @version 1.3.0
 * @license MIT
 */

// -------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------

const LAT_MIN = 2.5;
const LAT_MAX = 38.5;
const LON_MIN = 63.5;
const LON_MAX = 99.5;
const LAT_SPAN = LAT_MAX - LAT_MIN; // 36.0
const LON_SPAN = LON_MAX - LON_MIN; // 36.0
const DIGIPIN_LEVELS = 10;
const GRID_SUBDIVISION = 4;

const INDIA_BOUNDS = { MIN_LAT: LAT_MIN, MAX_LAT: LAT_MAX, MIN_LON: LON_MIN, MAX_LON: LON_MAX };
const DIGIPIN_ALPHABET = '23456789CFJKLMPT';

// Official spiral grid — row 0 = North, col 0 = West (matches official spec)
const _SPIRAL_GRID = [
    ['F', 'C', '9', '8'],
    ['J', '3', '2', '7'],
    ['K', '4', '5', '6'],
    ['L', 'M', 'P', 'T'],
];

// O(1) reverse lookup: character → {row, col}
const _SYMBOL_TO_POS = {};
for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
        _SYMBOL_TO_POS[_SPIRAL_GRID[r][c]] = { row: r, col: c };
    }
}

// O(1) character validity check
const _ALPHABET_SET = new Set(DIGIPIN_ALPHABET);

// -------------------------------------------------------------------------
// Validation
// -------------------------------------------------------------------------

/**
 * Checks if coordinates are within India's official bounding box.
 * @param {number} lat
 * @param {number} lon
 * @returns {boolean}
 */
function isValidCoordinate(lat, lon) {
    return lat >= LAT_MIN && lat <= LAT_MAX && lon >= LON_MIN && lon <= LON_MAX;
}

/**
 * Validates a DIGIPIN code.
 * @param {string} code
 * @param {boolean} strict - If true, requires exactly 10 characters
 * @returns {boolean}
 */
function isValid(code, strict = false) {
    if (!code || typeof code !== 'string') return false;
    const upper = code.toUpperCase();
    const len = upper.length;
    if (strict && len !== DIGIPIN_LEVELS) return false;
    if (len < 1 || len > DIGIPIN_LEVELS) return false;
    for (const ch of upper) {
        if (!_ALPHABET_SET.has(ch)) return false; // O(1) per char
    }
    return true;
}

// -------------------------------------------------------------------------
// Core: encode / decode / getBounds
// -------------------------------------------------------------------------

/**
 * Encode latitude/longitude into a DIGIPIN code.
 * @param {number} lat - Latitude (2.5 to 38.5)
 * @param {number} lon - Longitude (63.5 to 99.5)
 * @param {number} precision - Code length (1-10), default 10
 * @returns {string}
 */
function encode(lat, lon, precision = 10) {
    if (typeof lat !== 'number' || typeof lon !== 'number') {
        throw new Error('Latitude and longitude must be numbers');
    }
    if (!isValidCoordinate(lat, lon)) {
        throw new Error(
            `Coordinates (${lat}, ${lon}) are outside India's bounding box. ` +
            `Valid range: lat ${LAT_MIN}-${LAT_MAX}, lon ${LON_MIN}-${LON_MAX}`
        );
    }
    if (!Number.isInteger(precision) || precision < 1 || precision > DIGIPIN_LEVELS) {
        throw new Error('Precision must be an integer between 1 and 10');
    }

    let code = '';
    let minLat = LAT_MIN, maxLat = LAT_MAX;
    let minLon = LON_MIN, maxLon = LON_MAX;

    for (let level = 0; level < precision; level++) {
        const latStep = (maxLat - minLat) / GRID_SUBDIVISION;
        const lonStep = (maxLon - minLon) / GRID_SUBDIVISION;

        // row 0 = North, row 3 = South (same convention as Python)
        let row = 3 - Math.floor((lat - minLat) / latStep);
        let col = Math.floor((lon - minLon) / lonStep);

        // Clamp to [0, 3]
        row = Math.max(0, Math.min(row, 3));
        col = Math.max(0, Math.min(col, 3));

        code += _SPIRAL_GRID[row][col];

        // Update bounds — same logic as Python reference implementation
        maxLat = minLat + latStep * (4 - row);
        minLat = minLat + latStep * (3 - row);
        minLon = minLon + lonStep * col;
        maxLon = minLon + lonStep;
    }

    return code;
}

/**
 * Decode a DIGIPIN code to {lat, lon} centroid.
 * @param {string} code
 * @returns {{lat: number, lon: number}}
 */
function decode(code) {
    if (!isValid(code)) throw new Error(`Invalid DIGIPIN code: ${code}`);
    const upper = code.toUpperCase();
    let minLat = LAT_MIN, maxLat = LAT_MAX;
    let minLon = LON_MIN, maxLon = LON_MAX;

    for (const ch of upper) {
        const { row, col } = _SYMBOL_TO_POS[ch]; // O(1)
        const latStep = (maxLat - minLat) / GRID_SUBDIVISION;
        const lonStep = (maxLon - minLon) / GRID_SUBDIVISION;
        const lat1 = maxLat - latStep * (row + 1);
        const lat2 = maxLat - latStep * row;
        const lon1 = minLon + lonStep * col;
        const lon2 = minLon + lonStep * (col + 1);
        minLat = lat1; maxLat = lat2;
        minLon = lon1; maxLon = lon2;
    }

    return { lat: (minLat + maxLat) / 2, lon: (minLon + maxLon) / 2 };
}

/**
 * Get the bounding box of a DIGIPIN cell.
 * @param {string} code
 * @returns {{minLat: number, maxLat: number, minLon: number, maxLon: number}}
 */
function getBounds(code) {
    if (!isValid(code)) throw new Error(`Invalid DIGIPIN code: ${code}`);
    const upper = code.toUpperCase();
    let minLat = LAT_MIN, maxLat = LAT_MAX;
    let minLon = LON_MIN, maxLon = LON_MAX;

    for (const ch of upper) {
        const { row, col } = _SYMBOL_TO_POS[ch]; // O(1)
        const latStep = (maxLat - minLat) / GRID_SUBDIVISION;
        const lonStep = (maxLon - minLon) / GRID_SUBDIVISION;
        const newMinLat = maxLat - (row + 1) * latStep;
        const newMaxLat = maxLat - row * latStep;
        const newMinLon = minLon + col * lonStep;
        const newMaxLon = minLon + (col + 1) * lonStep;
        minLat = newMinLat; maxLat = newMaxLat;
        minLon = newMinLon; maxLon = newMaxLon;
    }

    return { minLat, maxLat, minLon, maxLon };
}

// -------------------------------------------------------------------------
// Hierarchical operations
// -------------------------------------------------------------------------

/**
 * Encode and return code with its bounding box.
 * @param {number} lat
 * @param {number} lon
 * @param {number} precision
 * @returns {{code: string, lat: number, lon: number, bounds: object}}
 */
function encodeWithBounds(lat, lon, precision = 10) {
    const code = encode(lat, lon, precision);
    return { code, lat, lon, bounds: getBounds(code) };
}

/**
 * Decode and return coordinates with bounding box.
 * @param {string} code
 * @returns {{code: string, lat: number, lon: number, bounds: object}}
 */
function decodeWithBounds(code) {
    const { lat, lon } = decode(code);
    return { code: code.toUpperCase(), lat, lon, bounds: getBounds(code) };
}

/**
 * Get parent code at a coarser level.
 * @param {string} code
 * @param {number} level - Target level (1 to code.length-1)
 * @returns {string}
 */
function getParent(code, level) {
    if (!isValid(code)) throw new Error(`Invalid DIGIPIN code: ${code}`);
    const upper = code.toUpperCase();
    if (!Number.isInteger(level) || level < 1 || level >= upper.length) {
        throw new Error(`Level must be an integer between 1 and ${upper.length - 1}`);
    }
    return upper.substring(0, level);
}

/**
 * Check if childCode is within the region represented by parentCode.
 * @param {string} childCode
 * @param {string} parentCode
 * @returns {boolean}
 */
function isWithin(childCode, parentCode) {
    if (!isValid(childCode)) throw new Error(`Invalid child DIGIPIN code: ${childCode}`);
    const child = childCode.toUpperCase();
    const parent = parentCode.toUpperCase();
    if (parent.length >= child.length) return false;
    return child.startsWith(parent);
}

// -------------------------------------------------------------------------
// Batch operations
// -------------------------------------------------------------------------

/**
 * Batch encode multiple coordinate pairs.
 * @param {Array<{lat: number, lon: number}>} coordinates
 * @param {number} precision
 * @returns {string[]}
 */
function batchEncode(coordinates, precision = 10) {
    return coordinates.map(coord => encode(coord.lat, coord.lon, precision));
}

/**
 * Batch decode multiple DIGIPIN codes.
 * @param {string[]} codes
 * @returns {Array<{lat: number, lon: number}>}
 */
function batchDecode(codes) {
    return codes.map(code => decode(code));
}

// -------------------------------------------------------------------------
// Grid utilities
// -------------------------------------------------------------------------

/**
 * Get grid cell size at a given precision level.
 * @param {number} level - Precision level (1-10)
 * @returns {{lat: number, lon: number}} Cell size in degrees
 */
function getGridSize(level) {
    if (!Number.isInteger(level) || level < 1 || level > DIGIPIN_LEVELS) {
        throw new Error(`Level must be between 1 and ${DIGIPIN_LEVELS}`);
    }
    const divisions = Math.pow(GRID_SUBDIVISION, level);
    return { lat: LAT_SPAN / divisions, lon: LON_SPAN / divisions };
}

/**
 * Get approximate linear cell size in meters at a given level.
 * @param {number} level
 * @returns {number} Approximate meters
 */
function getApproxDistance(level) {
    const { lat, lon } = getGridSize(level);
    return ((lat + lon) / 2) * 111000; // 1 degree ≈ 111 km
}

/**
 * Get detailed precision information for a given level.
 * @param {number} level - Default 10 (full precision)
 * @returns {object}
 */
function getPrecisionInfo(level = 10) {
    if (!Number.isInteger(level) || level < 1 || level > DIGIPIN_LEVELS) {
        throw new Error(`Level must be between 1 and ${DIGIPIN_LEVELS}`);
    }
    const { lat, lon } = getGridSize(level);
    const descriptions = {
        1: 'Regional level (~1000 km)',
        2: 'State level (~250 km)',
        3: 'District level (~62 km)',
        4: 'City level (~15 km)',
        5: 'Locality level (~4 km)',
        6: 'Neighborhood level (~1 km)',
        7: 'Block level (~250 m)',
        8: 'Building level (~60 m)',
        9: 'Property level (~15 m)',
        10: 'Precise location (~3.8 m)',
    };
    return {
        level,
        codeLength: level,
        gridSizeLatDeg: lat,
        gridSizeLonDeg: lon,
        approxDistanceM: getApproxDistance(level),
        totalCells: Math.pow(Math.pow(GRID_SUBDIVISION, level), 2),
        description: descriptions[level] || `Level ${level}`,
    };
}

// -------------------------------------------------------------------------
// Neighbor discovery
// -------------------------------------------------------------------------

/**
 * Get neighboring grid cells for a DIGIPIN code.
 * @param {string} code - Center DIGIPIN code
 * @param {string} direction - 'all' | 'cardinal' | 'north' | 'south' | 'east' | 'west' | ...
 * @returns {string[]}
 */
function getNeighbors(code, direction = 'all') {
    if (!isValid(code)) throw new Error(`Invalid DIGIPIN code: ${code}`);
    const upper = code.toUpperCase();
    const level = upper.length;
    const { lat: centerLat, lon: centerLon } = decode(upper);
    const { lat: latSpan, lon: lonSpan } = getGridSize(level);

    const offsets = {
        north:     [ 1,  0],
        northeast: [ 1,  1],
        east:      [ 0,  1],
        southeast: [-1,  1],
        south:     [-1,  0],
        southwest: [-1, -1],
        west:      [ 0, -1],
        northwest: [ 1, -1],
    };

    let selected;
    if (direction === 'all') {
        selected = Object.values(offsets);
    } else if (direction === 'cardinal') {
        selected = [offsets.north, offsets.south, offsets.east, offsets.west];
    } else if (offsets[direction]) {
        selected = [offsets[direction]];
    } else {
        const valid = [...Object.keys(offsets), 'all', 'cardinal'];
        throw new Error(`Invalid direction '${direction}'. Must be one of: ${valid.join(', ')}`);
    }

    const neighbors = [];
    for (const [latMult, lonMult] of selected) {
        const nLat = centerLat + latMult * latSpan;
        const nLon = centerLon + lonMult * lonSpan;
        if (isValidCoordinate(nLat, nLon)) {
            try {
                const nCode = encode(nLat, nLon, level);
                if (nCode !== upper) neighbors.push(nCode);
            } catch (e) {
                // skip — outside bounds
            }
        }
    }
    return neighbors;
}

/**
 * Get all cells within a radius (filled disk / square area).
 * @param {string} code - Center DIGIPIN code
 * @param {number} radius - 0 = center only, 1 = 3×3, 2 = 5×5, etc.
 * @returns {string[]}
 */
function getDisk(code, radius = 1) {
    if (!isValid(code)) throw new Error(`Invalid DIGIPIN code: ${code}`);
    if (!Number.isInteger(radius) || radius < 0) {
        throw new Error('Radius must be a non-negative integer');
    }
    const upper = code.toUpperCase();
    const level = upper.length;
    const { lat: centerLat, lon: centerLon } = decode(upper);
    const { lat: latSpan, lon: lonSpan } = getGridSize(level);
    const cells = new Set();

    for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
            const nLat = centerLat + dy * latSpan;
            const nLon = centerLon + dx * lonSpan;
            if (isValidCoordinate(nLat, nLon)) {
                try { cells.add(encode(nLat, nLon, level)); } catch (e) {}
            }
        }
    }
    return Array.from(cells);
}

/**
 * Get all cells at exactly radius distance (hollow ring).
 * @param {string} code - Center DIGIPIN code
 * @param {number} radius - >= 1
 * @returns {string[]}
 */
function getRing(code, radius) {
    if (!isValid(code)) throw new Error(`Invalid DIGIPIN code: ${code}`);
    if (!Number.isInteger(radius) || radius < 1) {
        throw new Error('Radius must be an integer >= 1');
    }
    const upper = code.toUpperCase();
    const level = upper.length;
    const { lat: centerLat, lon: centerLon } = decode(upper);
    const { lat: latSpan, lon: lonSpan } = getGridSize(level);
    const cells = new Set();

    // Top and bottom edges (full width)
    for (let dx = -radius; dx <= radius; dx++) {
        for (const dy of [radius, -radius]) {
            const nLat = centerLat + dy * latSpan;
            const nLon = centerLon + dx * lonSpan;
            if (isValidCoordinate(nLat, nLon)) {
                try {
                    const nCode = encode(nLat, nLon, level);
                    if (nCode !== upper) cells.add(nCode);
                } catch (e) {}
            }
        }
    }

    // Left and right edges (excluding corners already added)
    for (let dy = -radius + 1; dy < radius; dy++) {
        for (const dx of [radius, -radius]) {
            const nLat = centerLat + dy * latSpan;
            const nLon = centerLon + dx * lonSpan;
            if (isValidCoordinate(nLat, nLon)) {
                try {
                    const nCode = encode(nLat, nLon, level);
                    if (nCode !== upper) cells.add(nCode);
                } catch (e) {}
            }
        }
    }

    return Array.from(cells);
}

/** Alias for getNeighbors(code, 'all') */
function getSurroundingCells(code) {
    return getNeighbors(code, 'all');
}

/** Alias for getDisk(code, radius) */
function expandSearchArea(code, radius = 1) {
    return getDisk(code, radius);
}

// -------------------------------------------------------------------------
// Geospatial: polyfill, getPolygonBoundary
// -------------------------------------------------------------------------

/**
 * Ray-casting point-in-polygon test.
 * @param {number} lat
 * @param {number} lon
 * @param {Array<[number, number]>} polygon - [[lat, lon], ...]
 * @returns {boolean}
 */
function _pointInPolygon(lat, lon, polygon) {
    let inside = false;
    const n = polygon.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const [latI, lonI] = polygon[i];
        const [latJ, lonJ] = polygon[j];
        if (((latI > lat) !== (latJ > lat)) &&
            lon < ((lonJ - lonI) * (lat - latI) / (latJ - latI) + lonI)) {
            inside = !inside;
        }
    }
    return inside;
}

/** Check if two segments [p1→p2] and [p3→p4] intersect. */
function _segmentsIntersect(p1, p2, p3, p4) {
    const [lat1, lon1] = p1, [lat2, lon2] = p2;
    const [lat3, lon3] = p3, [lat4, lon4] = p4;
    const dLat1 = lat2 - lat1, dLon1 = lon2 - lon1;
    const dLat2 = lat4 - lat3, dLon2 = lon4 - lon3;
    const cross = dLat1 * dLon2 - dLon1 * dLat2;
    if (cross === 0) return false; // parallel
    const t = ((lat3 - lat1) * dLon2 - (lon3 - lon1) * dLat2) / cross;
    const u = ((lat3 - lat1) * dLon1 - (lon3 - lon1) * dLat1) / cross;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

/**
 * Determine spatial relationship between a DIGIPIN cell and a polygon.
 * @returns {'inside'|'outside'|'intersects'}
 */
function _getCellRelationship(code, polygon) {
    const { minLat, maxLat, minLon, maxLon } = getBounds(code);

    // Polygon bounding box for fast rejection
    let pMinLat = Infinity, pMaxLat = -Infinity;
    let pMinLon = Infinity, pMaxLon = -Infinity;
    for (const [lat, lon] of polygon) {
        if (lat < pMinLat) pMinLat = lat;
        if (lat > pMaxLat) pMaxLat = lat;
        if (lon < pMinLon) pMinLon = lon;
        if (lon > pMaxLon) pMaxLon = lon;
    }

    // Fast rejection: bounding boxes don't overlap
    if (minLat > pMaxLat || maxLat < pMinLat || minLon > pMaxLon || maxLon < pMinLon) {
        return 'outside';
    }

    const corners = [
        [minLat, minLon], [minLat, maxLon],
        [maxLat, minLon], [maxLat, maxLon],
    ];

    // All corners inside → cell is fully inside polygon
    if (corners.every(([lat, lon]) => _pointInPolygon(lat, lon, polygon))) {
        return 'inside';
    }

    // Any polygon vertex inside the cell → intersects
    for (const [lat, lon] of polygon) {
        if (lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon) {
            return 'intersects';
        }
    }

    // Any polygon edge crosses any cell edge → intersects
    const cellEdges = [
        [[minLat, minLon], [minLat, maxLon]],
        [[maxLat, minLon], [maxLat, maxLon]],
        [[minLat, minLon], [maxLat, minLon]],
        [[minLat, maxLon], [maxLat, maxLon]],
    ];
    const n = polygon.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
        const polyEdge = [polygon[j], polygon[i]];
        for (const cellEdge of cellEdges) {
            if (_segmentsIntersect(polyEdge[0], polyEdge[1], cellEdge[0], cellEdge[1])) {
                return 'intersects';
            }
        }
    }

    // Check if cell center is inside polygon (handles polygon-inside-cell case)
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;
    if (_pointInPolygon(centerLat, centerLon, polygon)) return 'intersects';

    return 'outside';
}

function _polyfillRecursive(code, targetPrecision, polygon, result) {
    const rel = _getCellRelationship(code, polygon);
    if (rel === 'outside') return;

    if (code.length >= targetPrecision) {
        const { minLat, maxLat, minLon, maxLon } = getBounds(code);
        const centerLat = (minLat + maxLat) / 2;
        const centerLon = (minLon + maxLon) / 2;
        if (_pointInPolygon(centerLat, centerLon, polygon)) {
            result.add(code);
        }
        return;
    }

    if (rel === 'inside') {
        // Fully inside — expand all children
        for (const ch of DIGIPIN_ALPHABET) {
            _polyfillRecursive(code + ch, targetPrecision, polygon, result);
        }
    } else {
        // Intersects boundary — subdivide and check each child
        for (const ch of DIGIPIN_ALPHABET) {
            _polyfillRecursive(code + ch, targetPrecision, polygon, result);
        }
    }
}

/**
 * Fill a polygon with DIGIPIN codes of a specific precision.
 *
 * No external dependencies required — uses built-in ray-casting geometry.
 *
 * @param {Array<[number, number]>} polygon - Array of [lat, lon] pairs (≥ 3 points)
 * @param {number} precision - Code length (1-10), default 7
 * @param {string} algorithm - 'quadtree' (O(Perimeter), default) or 'grid' (O(Area))
 * @returns {string[]} Sorted array of DIGIPIN codes inside the polygon
 */
function polyfill(polygon, precision = 7, algorithm = 'quadtree') {
    if (!Array.isArray(polygon) || polygon.length < 3) {
        throw new Error('Polygon must be an array of at least 3 [lat, lon] pairs');
    }
    if (!Number.isInteger(precision) || precision < 1 || precision > DIGIPIN_LEVELS) {
        throw new Error('Precision must be between 1 and 10');
    }
    if (algorithm !== 'quadtree' && algorithm !== 'grid') {
        throw new Error("Algorithm must be 'quadtree' or 'grid'");
    }

    const result = new Set();

    if (algorithm === 'quadtree') {
        // O(Perimeter) — only subdivides cells that touch the boundary
        for (const ch of DIGIPIN_ALPHABET) {
            _polyfillRecursive(ch, precision, polygon, result);
        }
        return Array.from(result).sort();
    }

    // Grid scan — O(Area)
    let pMinLat = Infinity, pMaxLat = -Infinity;
    let pMinLon = Infinity, pMaxLon = -Infinity;
    for (const [lat, lon] of polygon) {
        if (lat < pMinLat) pMinLat = lat;
        if (lat > pMaxLat) pMaxLat = lat;
        if (lon < pMinLon) pMinLon = lon;
        if (lon > pMaxLon) pMaxLon = lon;
    }

    const { lat: latStep, lon: lonStep } = getGridSize(precision);
    for (let currentLat = pMinLat + latStep / 2; currentLat < pMaxLat; currentLat += latStep) {
        for (let currentLon = pMinLon + lonStep / 2; currentLon < pMaxLon; currentLon += lonStep) {
            if (_pointInPolygon(currentLat, currentLon, polygon) &&
                isValidCoordinate(currentLat, currentLon)) {
                try { result.add(encode(currentLat, currentLon, precision)); } catch (e) {}
            }
        }
    }
    return Array.from(result);
}

/**
 * Get the bounding box that encompasses a list of DIGIPIN codes.
 * @param {string[]} codes
 * @returns {{minLat: number, maxLat: number, minLon: number, maxLon: number}}
 */
function getPolygonBoundary(codes) {
    if (!codes || codes.length === 0) {
        return { minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 };
    }
    let minLat = Infinity, maxLat = -Infinity;
    let minLon = Infinity, maxLon = -Infinity;

    for (const code of codes) {
        const b = getBounds(code);
        if (b.minLat < minLat) minLat = b.minLat;
        if (b.maxLat > maxLat) maxLat = b.maxLat;
        if (b.minLon < minLon) minLon = b.minLon;
        if (b.maxLon > maxLon) maxLon = b.maxLon;
    }
    return { minLat, maxLat, minLon, maxLon };
}

// -------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------

const _exports = {
    // Core
    encode,
    decode,
    isValid,
    isValidCoordinate,
    getBounds,
    // Hierarchical
    encodeWithBounds,
    decodeWithBounds,
    getParent,
    isWithin,
    // Batch
    batchEncode,
    batchDecode,
    // Neighbors
    getNeighbors,
    getDisk,
    getRing,
    getSurroundingCells,
    expandSearchArea,
    // Grid utilities
    getGridSize,
    getApproxDistance,
    getPrecisionInfo,
    // Geospatial
    polyfill,
    getPolygonBoundary,
    // Constants
    INDIA_BOUNDS,
    DIGIPIN_ALPHABET,
    DIGIPIN_LEVELS,
    LAT_MIN,
    LAT_MAX,
    LON_MIN,
    LON_MAX,
};

// CommonJS
if (typeof module !== 'undefined' && module.exports) {
    module.exports = _exports;
}

// Browser / ES module global
if (typeof window !== 'undefined') {
    window.digipin = _exports;
}
