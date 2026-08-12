// ColorStack UMN — motion primitives
// Type declarations for components/motion/*.jsx
// Combined into one file so the design-system compiler does not treat these
// handoff copies as a second set of components.

import * as React from 'react';

// ---------------------------------------------------------------- TextRoll

/** Rolls each character up into place when it scrolls into view. */
export interface TextRollProps {
  /** Text to roll. Falls back to flattened children. */
  text?: string;
  /** Per-character duration in ms */
  duration?: number;
  /** Seconds between characters */
  stagger?: number;
  /** Seconds before the first character rolls */
  delay?: number;
  /** Element tag to render */
  as?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function TextRoll(props: TextRollProps): JSX.Element;

// ---------------------------------------------------------------- TextLoop

/** Cycles through children on a timer — rotating phrases, or a photo roll with `stack`. */
export interface TextLoopProps {
  /** Seconds each child stays on screen */
  interval?: number;
  /** Absolutely stack children — use for images so the box does not resize */
  stack?: boolean;
  /** Crossfade duration in ms */
  transition?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function TextLoop(props: TextLoopProps): JSX.Element;

// ---------------------------------------------------------------- TextEffect

/** Per-character / per-word reveal, triggered on scroll into view. */
export interface TextEffectProps {
  /** Text to animate. Falls back to flattened children. */
  text?: string;
  /** Split granularity */
  per?: 'char' | 'word';
  /** Hidden-state treatment */
  preset?: 'fade' | 'fade-up' | 'blur';
  /** Seconds before the first unit animates */
  delay?: number;
  /** Seconds between units. Defaults to 0.018 (char) / 0.055 (word). */
  stagger?: number;
  /** Animate only the first time it enters view */
  once?: boolean;
  /** Element tag to render */
  as?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function TextEffect(props: TextEffectProps): JSX.Element;

// ---------------------------------------------------------------- ProgressiveBlur

/**
 * Layered progressive blur. Position it over a photo with `style`
 * (e.g. `{ bottom: 0, left: 0, width: '100%', height: '70%' }`).
 */
export interface ProgressiveBlurProps {
  /** Blur of the first layer in px; later layers ramp up from it */
  blurIntensity?: number;
  /** Number of stacked layers — more is smoother, costlier */
  layers?: number;
  /** Which edge is most blurred */
  direction?: 'bottom' | 'top';
  /** Fade the whole stack in and out */
  visible?: boolean;
  style?: React.CSSProperties;
}
export declare function ProgressiveBlur(props: ProgressiveBlurProps): JSX.Element;

// ---------------------------------------------------------------- PhotoReveal

/** Photo tile with a progressive-blur caption that rises on hover / tap. */
export interface PhotoRevealProps {
  src: string;
  alt?: string;
  /** Tile height — px number or any CSS length */
  height?: number | string;
  /** Tile width — px number or any CSS length; omit to fill the parent */
  width?: number | string;
  /** Corner radius in px */
  radius?: number;
  /** Blur of the first blur layer */
  blurIntensity?: number;
  /** How far up the tile the blur ramps */
  blurHeight?: string;
  /** CSS object-position for the photo */
  objectPosition?: string;
  /** Keep the caption visible instead of revealing on hover */
  always?: boolean;
  /** CSS filter applied to the photo */
  filter?: string;
  /** Caption content */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function PhotoReveal(props: PhotoRevealProps): JSX.Element;

// ---------------------------------------------------------------- InfiniteSlider

/** Seamless looping marquee for cards, logos, or quotes. */
export interface InfiniteSliderProps {
  /** Px between items */
  gap?: number;
  /** Seconds for one full loop — higher is slower */
  duration?: number;
  /** Travel right instead of left */
  reverse?: boolean;
  /** Pause the loop while the pointer is over it */
  pauseOnHover?: boolean;
  /** Soft mask at both edges */
  fade?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function InfiniteSlider(props: InfiniteSliderProps): JSX.Element;

// ---------------------------------------------------------------- AnimatedGroup

/** Staggered entrance for a set of children. Wrap a grid or flex row. */
export interface AnimatedGroupProps {
  /** Hidden-state treatment for each child */
  preset?: 'blur-slide' | 'rise' | 'scale' | 'fade';
  /** Seconds between children */
  stagger?: number;
  /** Seconds before the first child animates */
  delay?: number;
  /** When set, the group lays itself out as an auto-fit grid with this min column width (px) */
  minColumnWidth?: number;
  /** Grid gap in px, used with minColumnWidth */
  gap?: number;
  /** Animate only the first time it enters view */
  once?: boolean;
  /** Element tag to render (keep the layout styles on `style`) */
  as?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function AnimatedGroup(props: AnimatedGroupProps): JSX.Element;

// ---------------------------------------------------------------- Accordion

/**
 * Accordion with animated height and a rotating chevron.
 * Each direct child is one item; inside it, mark the trigger element with
 * `data-acc-title` and the panel element with `data-acc-body`.
 */
export interface AccordionProps {
  /** Allow several rows open at once */
  allowMultiple?: boolean;
  /** Index open on first render; -1 for all closed */
  defaultOpen?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Accordion(props: AccordionProps): JSX.Element;

// ---------------------------------------------------------------- LiquidMenu

/** Gooey floating action menu — children fan out of the trigger like liquid. */
export interface LiquidMenuProps {
  /** Blur radius feeding the gooey filter */
  blur?: number;
  /** Alpha contrast — higher tightens the merge */
  contrast?: number;
  /** Fill for the trigger and every item */
  fill?: string;
  /** Accessible label for the trigger */
  label?: string;
  /** Px the items travel when open */
  radius?: number;
  /** Trigger diameter in px */
  size?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function LiquidMenu(props: LiquidMenuProps): JSX.Element;
