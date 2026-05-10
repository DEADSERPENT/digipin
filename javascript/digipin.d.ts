/**
 * DIGIPIN-JS TypeScript Definitions
 * Official JavaScript implementation of India's national geocoding standard
 */

// -------------------------------------------------------------------------
// Shared types
// -------------------------------------------------------------------------

/** Coordinate pair */
export interface Coordinate {
    lat: number;
    lon: number;
}

/** Bounding box for a DIGIPIN cell */
export interface Bounds {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
}

/** India's bounding box constants */
export interface IndiaBounds {
    MIN_LAT: number;
    MAX_LAT: number;
    MIN_LON: number;
    MAX_LON: number;
}

/** Result of encodeWithBounds / decodeWithBounds */
export interface CodeWithBounds {
    code: string;
    lat: number;
    lon: number;
    bounds: Bounds;
}

/** Result of getPrecisionInfo */
export interface PrecisionInfo {
    level: number;
    codeLength: number;
    gridSizeLatDeg: number;
    gridSizeLonDeg: number;
    approxDistanceM: number;
    totalCells: number;
    description: string;
}

/** Grid cell size in degrees */
export interface GridSize {
    lat: number;
    lon: number;
}

/** Valid direction types for neighbor discovery */
export type Direction =
    | 'all'
    | 'cardinal'
    | 'north'
    | 'south'
    | 'east'
    | 'west'
    | 'northeast'
    | 'northwest'
    | 'southeast'
    | 'southwest';

/** Polygon fill algorithm */
export type PolyfillAlgorithm = 'quadtree' | 'grid';

// -------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------

/** India's bounding box */
export const INDIA_BOUNDS: IndiaBounds;

/** Valid DIGIPIN alphabet (16 characters) — alias for DIGIPIN_ALPHABET */
export const ALPHABET: string;

/** Valid DIGIPIN alphabet (16 characters) */
export const DIGIPIN_ALPHABET: string;

/** Maximum precision levels */
export const DIGIPIN_LEVELS: number;

/** Southernmost latitude of India's bounding box (2.5) */
export const LAT_MIN: number;

/** Northernmost latitude of India's bounding box (38.5) */
export const LAT_MAX: number;

/** Westernmost longitude of India's bounding box (63.5) */
export const LON_MIN: number;

/** Easternmost longitude of India's bounding box (99.5) */
export const LON_MAX: number;

// -------------------------------------------------------------------------
// Validation
// -------------------------------------------------------------------------

/**
 * Checks if coordinates are within India's official bounding box.
 * @param lat - Latitude (2.5 to 38.5)
 * @param lon - Longitude (63.5 to 99.5)
 */
export function isValidCoordinate(lat: number, lon: number): boolean;

/**
 * Validates a DIGIPIN code format.
 * @param code - DIGIPIN code to validate
 * @param strict - If true, requires exactly 10 characters (default: false)
 * @example
 * isValid('39J49LL8T4'); // true
 * isValid('39j49ll8t4'); // true (normalized)
 * isValid('39J49LL8T4', true); // true
 * isValid('39J49', true); // false (strict requires 10 chars)
 */
export function isValid(code: string, strict?: boolean): boolean;

// -------------------------------------------------------------------------
// Core: encode / decode / getBounds
// -------------------------------------------------------------------------

/**
 * Encodes latitude/longitude into a DIGIPIN code.
 * @param lat - Latitude (2.5 to 38.5)
 * @param lon - Longitude (63.5 to 99.5)
 * @param precision - Code length (1-10), default 10
 * @throws {Error} If coordinates are outside India's bounding box
 * @throws {Error} If precision is not between 1 and 10
 * @example
 * encode(28.622788, 77.213033); // '39J49LL8T4'
 * encode(28.622788, 77.213033, 5); // '39J49'
 */
export function encode(lat: number, lon: number, precision?: number): string;

/**
 * Decodes a DIGIPIN code to centroid coordinates.
 * @param code - DIGIPIN code (1-10 characters)
 * @throws {Error} If code is invalid
 * @example
 * decode('39J49LL8T4'); // { lat: 28.622793, lon: 77.213049 }
 */
export function decode(code: string): Coordinate;

/**
 * Gets the bounding box of a DIGIPIN cell.
 * @param code - DIGIPIN code
 * @throws {Error} If code is invalid
 * @example
 * getBounds('39J49LL8T4');
 * // { minLat: 28.622776, maxLat: 28.622810, minLon: 77.213032, maxLon: 77.213066 }
 */
export function getBounds(code: string): Bounds;

// -------------------------------------------------------------------------
// Hierarchical operations
// -------------------------------------------------------------------------

/**
 * Encodes coordinates and returns code with its bounding box.
 * @param lat - Latitude
 * @param lon - Longitude
 * @param precision - Code length (1-10), default 10
 */
export function encodeWithBounds(lat: number, lon: number, precision?: number): CodeWithBounds;

/**
 * Decodes a code and returns coordinates with bounding box.
 * @param code - DIGIPIN code
 * @throws {Error} If code is invalid
 */
export function decodeWithBounds(code: string): CodeWithBounds;

/**
 * Gets parent code at a coarser precision level.
 * @param code - DIGIPIN code
 * @param level - Target level (1 to code.length - 1)
 * @throws {Error} If code is invalid or level is out of range
 * @example
 * getParent('39J49LL8T4', 5); // '39J49'
 * getParent('39J49LL8T4', 1); // '3'
 */
export function getParent(code: string, level: number): string;

/**
 * Checks if childCode is within the region represented by parentCode.
 * @param childCode - The finer-precision code
 * @param parentCode - The coarser-precision code
 * @example
 * isWithin('39J49LL8T4', '39J49'); // true
 * isWithin('39J49LL8T4', '4FKP');  // false
 */
export function isWithin(childCode: string, parentCode: string): boolean;

// -------------------------------------------------------------------------
// Batch operations
// -------------------------------------------------------------------------

/**
 * Batch encodes multiple coordinate pairs.
 * @param coordinates - Array of { lat, lon } objects
 * @param precision - Code length (1-10), default 10
 */
export function batchEncode(coordinates: Coordinate[], precision?: number): string[];

/**
 * Batch decodes multiple DIGIPIN codes.
 * @param codes - Array of DIGIPIN codes
 */
export function batchDecode(codes: string[]): Coordinate[];

// -------------------------------------------------------------------------
// Grid utilities
// -------------------------------------------------------------------------

/**
 * Gets grid cell size in degrees at a given precision level.
 * @param level - Precision level (1-10)
 * @throws {Error} If level is out of range
 * @example
 * getGridSize(10); // { lat: 0.0000343..., lon: 0.0000343... }
 */
export function getGridSize(level: number): GridSize;

/**
 * Gets approximate cell size in meters at a given precision level.
 * Uses 1 degree ≈ 111 km.
 * @param level - Precision level (1-10)
 * @example
 * getApproxDistance(10); // ~3.81
 * getApproxDistance(6);  // ~976.6
 */
export function getApproxDistance(level: number): number;

/**
 * Gets detailed precision information for a given level.
 * @param level - Precision level (1-10), default 10
 * @throws {Error} If level is out of range
 */
export function getPrecisionInfo(level?: number): PrecisionInfo;

// -------------------------------------------------------------------------
// Neighbor discovery
// -------------------------------------------------------------------------

/**
 * Gets neighboring grid cells for a DIGIPIN code.
 * @param code - Center DIGIPIN code
 * @param direction - Which neighbors to return (default: 'all')
 * @throws {Error} If code or direction is invalid
 * @example
 * getNeighbors('39J49LL8T4');           // 8 neighbors
 * getNeighbors('39J49LL8T4', 'cardinal'); // N, S, E, W
 * getNeighbors('39J49LL8T4', 'north');    // [northCode]
 */
export function getNeighbors(code: string, direction?: Direction): string[];

/**
 * Gets all cells within a radius (filled square area).
 * @param code - Center DIGIPIN code
 * @param radius - 0 = center only, 1 = 3×3, 2 = 5×5, ... (default: 1)
 * @throws {Error} If code is invalid or radius is negative
 * @example
 * getDisk('39J49LL8T4', 1); // up to 9 codes (3x3)
 * getDisk('39J49LL8T4', 2); // up to 25 codes (5x5)
 */
export function getDisk(code: string, radius?: number): string[];

/**
 * Gets all cells at exactly radius distance (hollow ring).
 * Uses Chebyshev distance — diagonal moves count as 1 step.
 * @param code - Center DIGIPIN code
 * @param radius - Distance in cells (must be >= 1)
 * @throws {Error} If code is invalid or radius < 1
 * @example
 * getRing('39J49LL8T4', 1); // 8 immediate neighbors
 * getRing('39J49LL8T4', 2); // up to 16 cells on outer ring
 */
export function getRing(code: string, radius: number): string[];

/**
 * Alias for getNeighbors(code, 'all').
 */
export function getSurroundingCells(code: string): string[];

/**
 * Alias for getDisk(code, radius).
 */
export function expandSearchArea(code: string, radius?: number): string[];

// -------------------------------------------------------------------------
// Geospatial: polyfill / getPolygonBoundary
// -------------------------------------------------------------------------

/**
 * Fills a polygon with DIGIPIN codes of a specific precision.
 *
 * No external dependencies — uses built-in ray-casting geometry.
 *
 * @param polygon - Array of [lat, lon] pairs (minimum 3 points)
 * @param precision - Code length (1-10), default 7
 * @param algorithm - 'quadtree' (O(Perimeter), default) or 'grid' (O(Area))
 * @returns Sorted array of DIGIPIN codes whose centres lie inside the polygon
 * @throws {Error} If polygon has fewer than 3 points or precision/algorithm is invalid
 * @example
 * const zone = [[28.63, 77.22], [28.62, 77.21], [28.62, 77.23]];
 * const codes = polyfill(zone, 8);
 */
export function polyfill(
    polygon: [number, number][],
    precision?: number,
    algorithm?: PolyfillAlgorithm,
): string[];

/**
 * Gets the bounding box that encompasses a list of DIGIPIN codes.
 * @param codes - Array of DIGIPIN codes
 * @returns Combined bounding box, or zeroed box if codes is empty
 * @example
 * getPolygonBoundary(['39J49LL8T4', '39J49LL8T5']);
 * // { minLat: ..., maxLat: ..., minLon: ..., maxLon: ... }
 */
export function getPolygonBoundary(codes: string[]): Bounds;

// -------------------------------------------------------------------------
// Default export
// -------------------------------------------------------------------------

declare const digipin: {
    // Validation
    isValidCoordinate: typeof isValidCoordinate;
    isValid: typeof isValid;
    // Core
    encode: typeof encode;
    decode: typeof decode;
    getBounds: typeof getBounds;
    // Hierarchical
    encodeWithBounds: typeof encodeWithBounds;
    decodeWithBounds: typeof decodeWithBounds;
    getParent: typeof getParent;
    isWithin: typeof isWithin;
    // Batch
    batchEncode: typeof batchEncode;
    batchDecode: typeof batchDecode;
    // Grid utilities
    getGridSize: typeof getGridSize;
    getApproxDistance: typeof getApproxDistance;
    getPrecisionInfo: typeof getPrecisionInfo;
    // Neighbors
    getNeighbors: typeof getNeighbors;
    getDisk: typeof getDisk;
    getRing: typeof getRing;
    getSurroundingCells: typeof getSurroundingCells;
    expandSearchArea: typeof expandSearchArea;
    // Geospatial
    polyfill: typeof polyfill;
    getPolygonBoundary: typeof getPolygonBoundary;
    // Constants
    INDIA_BOUNDS: IndiaBounds;
    DIGIPIN_ALPHABET: string;
    DIGIPIN_LEVELS: number;
    LAT_MIN: number;
    LAT_MAX: number;
    LON_MIN: number;
    LON_MAX: number;
};

export default digipin;
