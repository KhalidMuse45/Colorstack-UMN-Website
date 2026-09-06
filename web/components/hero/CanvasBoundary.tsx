'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Catches anything the WebGL scene throws while mounting or rendering and
 * renders nothing in its place.
 *
 * `hasWebGL()` answers "is there a context available"; this answers "did the
 * scene survive". A driver that reports a context and then fails on a shader
 * compile, a texture the GPU refuses, a lost context on a laptop switching
 * graphics chips: all of them would otherwise take the whole page down with
 * them, because an uncaught render error in React unmounts the tree above it.
 *
 * Falling back costs the duotone lift and nothing else. The photograph is
 * already underneath, at the same size, in the same place.
 */
type Props = { children: ReactNode };
type State = { failed: boolean };

export default class CanvasBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Worth a console line: a silent fallback is how a broken hero ships.
    console.warn('Hero canvas failed, falling back to the static photo.', error, info.componentStack);
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}
