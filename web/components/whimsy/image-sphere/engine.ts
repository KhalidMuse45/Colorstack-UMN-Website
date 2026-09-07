import * as THREE from 'three';

const RADIUS = 180;
const PLANE_SIZE = 88;
type PlaneMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
type PlaneState = { index: number; aspect: number; home: THREE.Vector3; focus: number; baseTexture: THREE.Texture };

export interface ImageSphereOptions {
  distance?: number;
  fov?: number;
  detailUrls?: string[];
  onReady?: () => void;
  onError?: () => void;
  onHover?: (index: number | null) => void;
  onFocus?: (index: number | null) => void;
}

/** A rotating group of billboarded photo meshes, without custom shaders or a React renderer. */
export class ImageSphere {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private group = new THREE.Group();
  private planes: PlaneMesh[] = [];
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(-2, -2);
  private inverse = new THREE.Quaternion();
  private world = new THREE.Vector3();
  private center = new THREE.Vector3();
  private focused: PlaneMesh | null = null;
  private hovered: PlaneMesh | null = null;
  private rotation = new THREE.Vector2();
  private current = new THREE.Vector2();
  private velocity = new THREE.Vector2();
  private pointer: { id: number; x: number; y: number; downX: number; downY: number; touch: boolean; dragging: boolean; time: number } | null = null;
  private running = false;
  private paused = false;
  private disposed = false;
  private raf = 0;
  private lastTime = 0;
  private settleUntil = 0;
  private detailRequest = 0;
  private observer: ResizeObserver;
  private cleanup: (() => void)[] = [];

  constructor(private host: HTMLElement, urls: string[], private options: ImageSphereOptions = {}) {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0, 0);
    const canvas = this.renderer.domElement;
    Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block', cursor: 'grab', touchAction: 'pan-y' });
    canvas.setAttribute('aria-hidden', 'true');
    this.host.appendChild(canvas);
    this.camera = new THREE.PerspectiveCamera(options.fov ?? 38, 1, 1, 3000);
    this.scene.add(this.group);
    this.resize();
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(host);
    this.bindEvents();
    this.loadPlanes(urls);
  }

  private loadPlanes(urls: string[]) {
    const loader = new THREE.TextureLoader();
    let complete = 0;
    const finish = () => {
      if (this.disposed || ++complete !== urls.length) return;
      if (this.planes.length) this.options.onReady?.();
      else this.options.onError?.();
    };
    urls.forEach((url, index) => loader.load(url, (texture) => {
      if (this.disposed) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
      const aspect = texture.image.width / texture.image.height;
      const geometry = new THREE.PlaneGeometry(PLANE_SIZE * aspect, PLANE_SIZE);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false });
      const plane = new THREE.Mesh(geometry, material);
      // Fibonacci sampling avoids pole clustering; seeded offsets add a natural scatter.
      const z = 1 - 2 * (index + .5) / urls.length;
      const angle = index * Math.PI * (3 - Math.sqrt(5)) + Math.sin(index * 13.7) * .15;
      const radial = Math.sqrt(1 - z * z);
      plane.position.set(RADIUS * radial * Math.cos(angle), RADIUS * z, RADIUS * radial * Math.sin(angle));
      plane.userData = { index, aspect, home: plane.position.clone(), focus: 0, baseTexture: texture } satisfies PlaneState;
      this.group.add(plane);
      this.planes.push(plane);
      this.draw(1, true);
      finish();
    }, undefined, finish));
  }

  private resize() {
    if (this.disposed) return;
    const w = this.host.clientWidth || 1;
    const h = this.host.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    const halfFov = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const limitingFov = Math.atan(Math.tan(halfFov) * Math.min(1, this.camera.aspect));
    this.camera.position.z = Math.max(this.options.distance ?? 520, (RADIUS + 64) / Math.sin(limitingFov));
    this.camera.updateProjectionMatrix();
    this.draw(1, true);
  }

  private locate(event: PointerEvent) {
    const rect = this.host.getBoundingClientRect();
    this.mouse.set((event.clientX - rect.left) / rect.width * 2 - 1, 1 - (event.clientY - rect.top) / rect.height * 2);
  }

  private pick() {
    this.scene.updateMatrixWorld(true);
    this.camera.updateMatrixWorld(true);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    return (this.raycaster.intersectObjects(this.planes, false)[0]?.object as PlaneMesh | undefined) ?? null;
  }

  private setHover(plane: PlaneMesh | null) {
    if (this.hovered === plane) return;
    this.hovered = plane;
    this.options.onHover?.(plane ? plane.userData.index : null);
    this.wake();
  }

  private bindEvents() {
    const canvas = this.renderer.domElement;
    const down = (event: PointerEvent) => {
      if (!this.running || event.button !== 0 || !event.isPrimary) return;
      this.locate(event);
      this.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, downX: event.clientX, downY: event.clientY, touch: event.pointerType === 'touch', dragging: false, time: performance.now() };
      this.velocity.set(0, 0);
      this.wake();
    };
    const move = (event: PointerEvent) => {
      if (!this.running) return;
      this.locate(event);
      const pointer = this.pointer;
      if (!pointer || pointer.id !== event.pointerId) { if (!this.focused) this.setHover(this.pick()); return; }
      const totalX = event.clientX - pointer.downX;
      const totalY = event.clientY - pointer.downY;
      if (!pointer.dragging) {
        if (Math.hypot(totalX, totalY) < 6) return;
        // Native vertical scrolling wins; capture only an intentional horizontal touch drag.
        if (pointer.touch && Math.abs(totalY) > Math.abs(totalX)) { this.pointer = null; return; }
        pointer.dragging = true;
        canvas.setPointerCapture(event.pointerId);
      }
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      const dt = Math.max((performance.now() - pointer.time) / 1000, .008);
      this.rotation.y += dx * .004;
      this.rotation.x += dy * .004;
      this.velocity.set(THREE.MathUtils.clamp(dy * .004 / dt, -2, 2), THREE.MathUtils.clamp(dx * .004 / dt, -2, 2));
      pointer.x = event.clientX; pointer.y = event.clientY; pointer.time = performance.now();
      canvas.style.cursor = 'grabbing';
      this.setHover(null);
      this.wake();
    };
    const release = (event: PointerEvent) => {
      const pointer = this.pointer;
      if (!pointer || pointer.id !== event.pointerId) return;
      this.pointer = null;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      if (event.type === 'pointercancel' || performance.now() - pointer.time > 100) this.velocity.set(0, 0);
      if (event.type === 'pointerup' && !pointer.dragging && Math.hypot(event.clientX - pointer.downX, event.clientY - pointer.downY) <= 6) {
        this.locate(event);
        const hit = this.pick();
        this.focused = hit === this.focused ? null : hit;
        this.velocity.set(0, 0);
        this.setHover(null);
        this.options.onFocus?.(this.focused ? this.focused.userData.index : null);
        this.loadFocusedDetail();
      }
      canvas.style.cursor = 'grab';
      this.wake();
    };
    const leave = () => { this.mouse.set(-2, -2); this.setHover(null); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape' && this.focused) this.clearFocus(); };
    const lost = (event: Event) => { event.preventDefault(); this.stop(); this.options.onError?.(); };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    window.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('pointerleave', leave);
    canvas.addEventListener('webglcontextlost', lost);
    window.addEventListener('keydown', key);
    this.cleanup.push(() => {
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', release);
      canvas.removeEventListener('pointercancel', release);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('webglcontextlost', lost);
      window.removeEventListener('keydown', key);
    });
  }

  private loadFocusedDetail() {
    const request = ++this.detailRequest;
    for (const plane of this.planes) {
      const base = (plane.userData as PlaneState).baseTexture;
      if (plane.material.map !== base) { plane.material.map?.dispose(); plane.material.map = base; }
    }
    const focused = this.focused;
    const url = focused && this.options.detailUrls?.[focused.userData.index];
    if (!focused || !url) return;
    new THREE.TextureLoader().load(url, texture => {
      if (this.disposed || request !== this.detailRequest || this.focused !== focused) { texture.dispose(); return; }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
      focused.material.map = texture;
      this.wake();
    }, undefined, () => { /* The original thumbnail stays visible if detail fails. */ });
  }

  clearFocus() { this.focused = null; this.loadFocusedDetail(); this.options.onFocus?.(null); this.wake(); }
  setPaused(paused: boolean) { this.paused = paused; this.velocity.set(0, 0); this.wake(); }
  start() { if (this.disposed) return; this.running = true; this.lastTime = 0; this.wake(); }
  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    if (this.pointer && this.renderer.domElement.hasPointerCapture(this.pointer.id)) this.renderer.domElement.releasePointerCapture(this.pointer.id);
    this.pointer = null;
    this.velocity.set(0, 0);
  }

  private wake() {
    this.settleUntil = performance.now() + 500;
    if (this.running && !this.raf && !this.disposed) this.raf = requestAnimationFrame(this.loop);
  }

  private loop = (time: number) => {
    this.raf = 0;
    if (!this.running || this.disposed) return;
    const dt = Math.min(this.lastTime ? (time - this.lastTime) / 1000 : 1 / 60, .05);
    this.lastTime = time;
    if (!this.focused) {
      if (!this.pointer) {
        if (!this.paused) { this.rotation.y += .03 * dt; this.rotation.x += .012 * dt; }
        this.rotation.addScaledVector(this.velocity, dt);
        this.velocity.multiplyScalar(Math.exp(-7 * dt));
      }
      this.current.lerp(this.rotation, 1 - Math.exp(-18 * dt));
      this.group.rotation.set(this.current.x, this.current.y, 0);
    }
    this.draw(dt);
    if (!this.pointer && !this.focused) this.setHover(this.pick());
    if ((!this.paused && !this.focused) || this.pointer || time < this.settleUntil) {
      if (!this.raf) this.raf = requestAnimationFrame(this.loop);
    }
  };

  private draw(dt: number, immediate = false) {
    if (this.disposed) return;
    this.group.updateMatrixWorld(true);
    this.inverse.copy(this.group.quaternion).invert();
    const focusDistance = 300;
    const viewHeight = 2 * focusDistance * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const viewWidth = viewHeight * this.camera.aspect;
    this.center.set(0, 0, this.camera.position.z - focusDistance);
    this.group.worldToLocal(this.center);
    const ease = immediate ? 1 : 1 - Math.exp(-16 * dt);
    for (const plane of this.planes) {
      const data = plane.userData as PlaneState;
      plane.quaternion.copy(this.inverse);
      data.focus += ((plane === this.focused ? 1 : 0) - data.focus) * ease;
      plane.position.copy(data.home).lerp(this.center, data.focus);
      plane.getWorldPosition(this.world);
      const depthScale = .85 + this.world.z / 2000;
      const normalScale = depthScale * (plane === this.hovered ? 1.2 : 1);
      const focusScale = Math.min(viewHeight * .75 / PLANE_SIZE, viewWidth * .85 / (PLANE_SIZE * data.aspect));
      const targetScale = THREE.MathUtils.lerp(normalScale, focusScale, data.focus);
      plane.scale.setScalar(THREE.MathUtils.lerp(plane.scale.x, targetScale, ease));
      const opacity = this.focused ? .16 + .84 * data.focus : 1;
      plane.material.opacity += (opacity - plane.material.opacity) * ease;
      plane.renderOrder = data.focus > .5 ? 1 : 0;
    }
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.disposed = true;
    this.stop();
    this.cleanup.forEach((cleanup) => cleanup());
    this.observer.disconnect();
    for (const plane of this.planes) {
      plane.geometry.dispose();
      const base = (plane.userData as PlaneState).baseTexture;
      if (plane.material.map !== base) plane.material.map?.dispose();
      base.dispose(); plane.material.dispose();
    }
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
