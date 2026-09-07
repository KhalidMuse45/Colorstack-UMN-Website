'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { imageUrl } from '@/lib/image';
import type { ImageSphere } from './image-sphere/engine';
import styles from './FloatingCards.module.css';

export type FloatingCardsPhoto = { id?: string; src: string; alt: string; width: number; height: number };

/** The real photo gallery is the default; WebGL is an optional, deferred enhancement. */
export default function FloatingCards({ photos }: { photos: FloatingCardsPhoto[] }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<ImageSphere | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [gallery, setGallery] = useState(false);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const urls = useMemo(() => photos.slice(0, 16).map((p) => imageUrl(p.src, 480)), [photos]);
  const detailUrls = useMemo(() => photos.slice(0, 16).map((p) => imageUrl(p.src, 1200)), [photos]);
  const sphereVisible = ready && !gallery && !reducedMotion && !failed;
  const fullGallery = gallery || reducedMotion === true || failed;
  const galleryPhotos = fullGallery ? photos : photos.slice(0, 4);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setPageVisible(document.visibilityState === 'visible');
    updateMotion(); updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); preload.disconnect(); }
    }, { rootMargin: '250px' });
    const viewport = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (root.current) { preload.observe(root.current); viewport.observe(root.current); }
    return () => {
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
      preload.disconnect(); viewport.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!near || reducedMotion !== false || failed || !urls.length) return;
    let cancelled = false;
    let instance: ImageSphere | null = null;
    import('./image-sphere/engine').then(({ ImageSphere }) => {
      if (cancelled || !host.current) return;
      instance = new ImageSphere(host.current, urls, {
        detailUrls,
        onReady: () => { if (!cancelled) setReady(true); },
        onError: () => { if (!cancelled) setFailed(true); },
        onHover: setHovered, onFocus: setFocused,
      });
      engine.current = instance;
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => {
      cancelled = true; instance?.destroy(); engine.current = null; setReady(false);
    };
  }, [near, reducedMotion, failed, urls, detailUrls]);

  useEffect(() => {
    const sphere = engine.current;
    if (!sphere) return;
    sphere.setPaused(paused);
    if (sphereVisible && visible && pageVisible && open === null) sphere.start();
    else sphere.stop();
  }, [sphereVisible, visible, pageVisible, paused, open]);

  useEffect(() => {
    if (open !== null) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);

  const photo = open === null ? null : photos[open];
  const captionPhoto = focused ?? hovered;
  return (
    <div ref={root} className={styles.root}>
      <div className={styles.toolbar}>
        <p>Campus days. Conference nights.</p>
        <div className={styles.controls}>
          {sphereVisible && <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Resume rotation' : 'Pause rotation'}</button>}
          {!reducedMotion && !failed && (!gallery || ready) && (
            <button type="button" aria-pressed={gallery} aria-controls={`${id}-gallery`} onClick={() => setGallery(!gallery)}>{gallery ? 'Explore sphere' : 'View photo gallery'}</button>
          )}
        </div>
      </div>
      <div className={`${styles.visual} ${!fullGallery ? styles.preview : ''}`} id={`${id}-gallery`}>
        <div ref={host} className={`${styles.stage} ${sphereVisible ? styles.stageVisible : ''}`} aria-hidden="true" />
        {!sphereVisible && (
          <ul className={styles.gallery}>
            {galleryPhotos.map((p, index) => (
              <li key={p.id ?? `${p.src}-${index}`}>
                <button type="button" onClick={() => { setGallery(true); setOpen(index); }} aria-label={`View photo: ${p.alt}`}>
                  <ResponsiveImage src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(max-width: 600px) 43vw, (max-width: 1000px) 28vw, 250px" className={styles.thumbnail} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={styles.footnote}>
        <p>{sphereVisible ? (captionPhoto !== null ? photos[captionPhoto]?.alt : 'Drag to turn. Select a photo to look closer.') : 'Select a photo to look closer.'}</p>
        {sphereVisible && focused !== null && <button type="button" onClick={() => engine.current?.clearFocus()}>Close photo</button>}
      </div>
      <dialog ref={dialog} className={styles.dialog} onClose={() => setOpen(null)} onClick={(event) => { if (event.target === event.currentTarget) setOpen(null); }} aria-labelledby={`${id}-caption`}>
        {photo && <div className={styles.dialogContent}>
          <button type="button" className={styles.close} onClick={() => setOpen(null)} autoFocus>Close photo</button>
          <figure>
            <ResponsiveImage src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} sizes="(max-width: 900px) 90vw, 1000px" loading="eager" className={styles.fullPhoto} />
            <figcaption id={`${id}-caption`}>{photo.alt}</figcaption>
          </figure>
        </div>}
      </dialog>
    </div>
  );
}
