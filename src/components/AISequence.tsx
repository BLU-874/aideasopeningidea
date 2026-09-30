import { useEffect, useRef } from 'react';
import frameManifest from '@/generated/frameManifest.json';

const FALLBACK_IMAGE = '/assets/img/logo-icon.png';
const DPR_CAP = 1.75;
const LERP = 0.07;

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  mobile: boolean,
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const coverScale = Math.max(w / iw, h / ih);
  const containScale = Math.min(w / iw, h / ih);
  const scale = mobile ? coverScale * 0.82 + containScale * 0.18 : coverScale;
  const dw = iw * scale;
  const dh = ih * scale;
  const fx = 0.5;
  const fy = mobile ? 0.42 : 0.5;
  const dx = w / 2 - dw * fx;
  const dy = h / 2 - dh * fy;
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, dx, dy, dw, dh);
}

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
const FIRST: string | null =
  Array.isArray(frameManifest) && frameManifest.length > 0
    ? (frameManifest as string[])[0]
    : null;

export function AISequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);
  const copyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const frames: string[] = Array.isArray(frameManifest) ? (frameManifest as string[]) : [];
    const has = frames.length > 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = () => window.innerWidth < 768;
    const imgs: Array<HTMLImageElement | undefined> = new Array(frames.length);
    const ok = new Array<boolean>(frames.length).fill(false);
    const cur = { v: 0 };
    const shown = { v: -1 };
    let raf = 0;
    let dead = false;
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      shown.v = -1;
    }
    function nearest(i: number): number {
      if (!has) return -1;
      if (ok[i]) return i;
      for (let d = 1; d < frames.length; d++) {
        if (i - d >= 0 && ok[i - d]) return i - d;
        if (i + d < frames.length && ok[i + d]) return i + d;
      }
      return -1;
    }
    function draw(i: number) {
      const r = canvas.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const li = nearest(i);
      if (li >= 0 && imgs[li]) {
        drawCover(ctx, imgs[li]!, r.width, r.height, mobile());
        if (fallbackRef.current) fallbackRef.current.style.opacity = '0';
      } else if (fallbackRef.current) {
        fallbackRef.current.style.opacity = '1';
      }
    }
    function load(i: number, hp = false) {
      if (!has || i < 0 || i >= frames.length || imgs[i]) return;
      const el = new Image();
      el.decoding = hp ? 'sync' : 'async';
      el.src = frames[i];
      imgs[i] = el;
      const done = () => { ok[i] = true; if (i === 0) draw(0); shown.v = -1; };
      if (el.complete && el.naturalWidth > 0) done();
      else { el.onload = done; el.onerror = () => { ok[i] = false; }; }
    }
    if (has) {
      load(0, true);
      [1, 2, 3, 4, 5, frames.length - 1].forEach((xv) => load(xv));
      let q = 6;
      const w2 = window as unknown as { requestIdleCallback?: (c: () => void) => void };
      const pump = () => {
        if (dead || reduce) return;
        let b = 2;
        while (b-- > 0 && q < frames.length) { load(q); q++; }
        if (q < frames.length) { if (w2.requestIdleCallback) w2.requestIdleCallback(pump); else setTimeout(pump, 300); }
      };
      if (w2.requestIdleCallback) w2.requestIdleCallback(pump); else setTimeout(pump, 500);
    }
    function prog(): number {
      const r = section.getBoundingClientRect();
      const t = r.height - window.innerHeight;
      if (t <= 0) return 0;
      return clamp01(-r.top / t);
    }
    function syncCopy(p: number) {
      const beats = [0, 0.02, 0.22, 0.47, 0.72];
      let a = 0;
      for (let k = 0; k < beats.length; k++) if (p >= beats[k] - 0.005) a = k;
      copyRefs.current.forEach((el, k) => {
        if (!el) return;
        const on = k === a;
        el.style.opacity = on ? '1' : '0';
        el.style.transform = on ? 'translateY(0)' : 'translateY(26px)';
        el.style.pointerEvents = on ? 'auto' : 'none';
      });
      if (barRef.current) barRef.current.style.transform = 'scaleX(' + p + ')';
      const tail = clamp01((p - 0.86) / 0.14);
      canvas.style.opacity = String(1 - tail * 0.55);
    }
    function tick() {
      if (dead) return;
      const p = prog();
      if (reduce) cur.v = p;
      else {
        const d = p - cur.v;
        cur.v += d * LERP;
        if (Math.abs(d) < 0.0004) cur.v = p;
      }
      if (has) {
        const idx = Math.round(cur.v * (frames.length - 1));
        if (idx !== shown.v) {
          shown.v = idx;
          load(idx); load(idx + 1); load(idx - 1);
          draw(idx);
        }
      }
      syncCopy(p);
      raf = requestAnimationFrame(tick);
    }
    size();
    draw(0);
    syncCopy(prog());
    raf = requestAnimationFrame(tick);
    const rs = () => size();
    window.addEventListener('resize', rs);
    return () => { dead = true; cancelAnimationFrame(raf); window.removeEventListener('resize', rs); };
  }, []);

  const beat = (i: number) => (el: HTMLDivElement | null) => { copyRefs.current[i] = el; };

  return (
    <section ref={sectionRef} className="seq-section" aria-label="Scroll-driven AI story">
      <div className="seq-sticky">
        <canvas ref={canvasRef} className="seq-canvas" aria-hidden="true" />
        <img ref={fallbackRef} className="seq-fallback" src={FIRST ?? FALLBACK_IMAGE} alt="" aria-hidden="true" />
        <div className="seq-vignette" aria-hidden="true" />
        <div className="seq-fade-bottom" aria-hidden="true" />
        <div className="seq-copy-layer">
          <div ref={beat(0)} className="seq-beat seq-beat--left" style={{ opacity: 1 }}>
            <div className="seq-eyebrow">Artificial Intelligence Club</div>
            <h1 className="seq-title">WE BUILD<br />WHAT WE&rsquo;RE<br />CURIOUS ABOUT.</h1>
            <p className="seq-body">A student community exploring AI through projects, workshops and things we probably started at 2 a.m.</p>
            <div className="seq-hero-actions">
              <a href="#work" className="btn btn-primary">See what we&rsquo;re building</a>
              <a href="#about" className="btn btn-ghost seq-ghost">Meet the club</a>
            </div>
            <div className="seq-scroll-hint"><span className="seq-scroll-line" />Scroll to connect</div>
          </div>
          <div ref={beat(1)} className="seq-beat seq-beat--left" style={{ opacity: 0 }}>
            <div className="seq-eyebrow">01 — Questions first</div>
            <h2 className="seq-title">WE START<br />WITH QUESTIONS.</h2>
            <p className="seq-body">Most of ours begin with: &ldquo;what if we tried this?&rdquo;</p>
          </div>
          <div ref={beat(2)} className="seq-beat seq-beat--left" style={{ opacity: 0 }}>
            <div className="seq-eyebrow">02 — Better together</div>
            <h2 className="seq-title">IDEAS GET<br />BETTER TOGETHER.</h2>
            <p className="seq-body">Coders, designers, builders and curious people.</p>
            <div className="seq-tags">
              <span className="seq-tag">Machine Learning</span>
              <span className="seq-tag">Computer Vision</span>
              <span className="seq-tag">NLP</span>
              <span className="seq-tag">Robotics</span>
              <span className="seq-tag">Data</span>
              <span className="seq-tag">Generative AI</span>
            </div>
          </div>
          <div ref={beat(3)} className="seq-beat seq-beat--center" style={{ opacity: 0 }}>
            <div className="seq-eyebrow seq-eyebrow--center">03 — The touch</div>
            <h2 className="seq-title seq-title--big">HUMAN CURIOSITY.<br /><span className="seq-amber">MACHINE INTELLIGENCE.</span></h2>
            <p className="seq-body seq-body--center">AI is the tool. The interesting part is what people decide to do with it.</p>
          </div>
          <div ref={beat(4)} className="seq-beat seq-beat--left" style={{ opacity: 0 }}>
            <div className="seq-eyebrow">04 — Energy</div>
            <h2 className="seq-title">BUILD. BREAK.<br />LEARN. REPEAT.</h2>
            <p className="seq-body">That&rsquo;s pretty much how the club works.</p>
          </div>
        </div>
        <div className="seq-progress" aria-hidden="true"><div ref={barRef} className="seq-progress-bar" /></div>
      </div>
    </section>
  );
}
