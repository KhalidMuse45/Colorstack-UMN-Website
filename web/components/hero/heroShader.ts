/**
 * Hero photo shader. One full-screen plane, cover-fit.
 *
 * The photograph is full colour at every scroll position. There is no tint,
 * no two-tone step and no colour lift: the hero moment is the aperture
 * opening plus the zoom, and the photo is simply itself the whole way through.
 *
 * uProgress  0..1 from ScrollTrigger
 * uPointer   normalized pointer, eased in HeroScene
 * uZoom      UV zoom, 1.00 → 1.45, driven by progress.
 */
export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2  uCover;     // uv scale to cover-fit the texture in the plane
  uniform vec2  uPointer;   // -1..1
  uniform float uTime;
  uniform float uZoom;
  uniform float uGrain;
  uniform float uDisplace;  // 0 on mobile, where there is no cursor to push from

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    // cover-fit and zoom about center
    vec2 uv = (vUv - 0.5) * uCover / uZoom + 0.5;

    // pointer displacement: a soft push away from the cursor, in uv space
    vec2 p = uPointer * 0.5 + 0.5;
    vec2 d = uv - p;
    float dist = length(d);
    float push = smoothstep(0.35, 0.0, dist) * uDisplace;
    uv += normalize(d + 1e-5) * push * 0.012;

    vec3 outCol = texture2D(uTexture, uv).rgb;

    // film grain
    float g = hash(vUv * 900.0 + fract(uTime)) - 0.5;
    outCol += g * uGrain;

    gl_FragColor = vec4(outCol, 1.0);
  }
`;
