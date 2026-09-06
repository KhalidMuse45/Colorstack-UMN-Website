/**
 * The only JS file allowed to contain literal hexes (see docs/01-BRAND-RULES.md).
 * Mirrors app/globals.css. Read by the hero shader and by any canvas code.
 */
export const tokens = {
  maroon: '#7A0019',
  maroonDeep: '#5B0013',
  maroonLight: '#900021',
  gold: '#FFCC33',
  goldDark: '#FFB71E',
  goldSoft: '#FFDE7A',
  page: '#FFFFFF',
  surfaceWarm: '#FBF5EC',
  /** alias for surfaceWarm */
  cream: '#FBF5EC',
  paper: '#FFFFFF',
  ink: '#1F1A17',
  inkSoft: '#5C534E',
  line: '#E8DCCB',
  rose: '#C6887F',
  stackYellow: '#FCB432',
  teal: '#2E9E91',
  pink: '#F0426B',
} as const;

export type TokenName = keyof typeof tokens;

/** Hex → [r, g, b] in 0..1, for GLSL uniforms. */
export function hexToRgb01(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
