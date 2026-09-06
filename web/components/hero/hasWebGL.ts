/**
 * Can this browser give us a WebGL context at all?
 *
 * The one fallback the site has is technical: no context means no HeroScene,
 * and the static colour photograph already sitting under the canvas becomes
 * the whole picture. Everything else on the hero still animates.
 *
 * The probe canvas is thrown away immediately. Some drivers cap the number of
 * live contexts, and holding one open here would be spending the hero's.
 */
export function hasWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl');
    if (!gl) return false;
    // Free it now rather than waiting on garbage collection.
    const lose = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return true;
  } catch {
    return false;
  }
}
