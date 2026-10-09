import { useEffect, useRef } from 'react';
import logoUrl from '@/assets/logo-mark.png';

interface Particle {
  tx: number; ty: number;
  x: number; y: number;
  vx: number; vy: number;
  sx: number; sy: number;
  hx: number; hy: number;
  k: number; g: boolean; r: number; ph: number;
}

interface Props {
  reduce: boolean;
}

export default function HeroCanvas({ reduce }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const hero = canvas.closest<HTMLElement>('.hero');
    if (!hero) return;

    const logo = new Image();
    logo.src = logoUrl;

    let W = 0, H = 0, dpr = 1;
    let raf = 0;
    let running = true;
    let visible = true;
    let scrollY0 = window.scrollY;
    let scrollVel = 0;
    let lastScrollY = window.scrollY;
    const mouse = { x: -9999, y: -9999, tx: 0, ty: 0 };

    let parts: Particle[] = [];
    let pKey = '';
    let pSize = 2;

    const introDelay = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--intro')
    ) || 0;
    const t0 = performance.now() + introDelay * 1000 * 0.55;

    function buildParticles(lw: number, lh: number) {
      const w = Math.max(40, Math.round(lw));
      const h = Math.max(30, Math.round(lh));
      const key = `${w}x${h}`;
      if (key === pKey) return;
      pKey = key;

      const oc = document.createElement('canvas');
      oc.width = w;
      oc.height = h;
      const o = oc.getContext('2d');
      if (!o) return;
      o.drawImage(logo, 0, 0, w, h);

      let data: Uint8ClampedArray;
      try {
        data = o.getImageData(0, 0, w, h).data;
      } catch {
        parts = [];
        return;
      }

      const gap = Math.max(3, Math.round(w / (W < 700 ? 85 : 135)));
      pSize = Math.max(1.4, gap * 0.62);
      const old = parts;
      parts = [];

      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          if (data[(y * w + x) * 4 + 3]! > 110) {
            const q = old.length ? old[parts.length % old.length] : null;
            parts.push({
              tx: x - w / 2,
              ty: y - h / 2,
              x: q ? q.x : Math.random() * W,
              y: q ? q.y : (Math.random() < 0.5 ? -20 : H + 20) + Math.random() * 60,
              vx: 0, vy: 0,
              sx: 0, sy: 0, hx: 0, hy: 0,
              k: 0.02,
              r: Math.random(),
              g: Math.random() < 0.24,
              ph: Math.random() * 6.283,
            });
          }
        }
      }
    }

    function size() {
      const r = canvas!.getBoundingClientRect();
      const oW = W, oH = H;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (parts.length && Math.abs(W - oW) < 2) {
        parts.forEach((p) => { p.y = p.y * H / (oH || H); });
        return;
      }
    }

    function frame(now: number) {
      const t = Math.max(0, (now - t0) / 1000);
      const intro = reduce ? 1 : Math.min(1, t / 1.6);
      const ease = 1 - Math.pow(1 - intro, 3);

      ctx!.fillStyle = '#0B0B0A';
      ctx!.fillRect(0, 0, W, H);

      mouse.tx += ((mouse.x > 0 ? mouse.x / W - 0.5 : 0) - mouse.tx) * 0.05;
      mouse.ty += ((mouse.y > 0 ? mouse.y / H - 0.5 : 0) - mouse.ty) * 0.05;

      if (logo.complete && logo.naturalWidth) {
        const mobile = W < 700;
        const sc = Math.min(1, scrollY0 / (H || 1));
        const lw = Math.min(
          W * (mobile ? 0.8 : 0.42),
          (H * 0.72 * logo.naturalWidth) / logo.naturalHeight,
          600
        );
        const lh = (lw * logo.naturalHeight) / logo.naturalWidth;
        buildParticles(lw, lh);

        const isRTL = document.documentElement.dir === 'rtl';
        let cx = mobile ? W * 0.6 : W * 0.74;
        if (isRTL) cx = W - cx;
        cx += mouse.tx * 24;

        const cy = H * (mobile ? 0.34 : 0.5) + mouse.ty * 18 - scrollY0 * 0.2;
        const bob = reduce ? 0 : Math.sin(t * 0.8) * 7;
        const tilt = (reduce ? 0 : Math.sin(t * 0.35) * 0.035) + sc * 0.35 * (isRTL ? -1 : 1);
        const cs = Math.cos(tilt), sn = Math.sin(tilt);
        const spread = 1 + sc * 0.7;
        const k = 0.018 + 0.05 * ease;

        for (const p of parts) {
          const bx = p.tx * spread;
          const by = p.ty * spread;
          const gx = cx + bx * cs - by * sn + (p.r - 0.5) * sc * 320;
          const gy = cy + bob + bx * sn + by * cs + (p.r - 0.35) * sc * 220 + (reduce ? 0 : Math.sin(t * 1.1 + p.ph) * 1.1);

          if (reduce) { p.x = gx; p.y = gy; continue; }

          p.vx += (gx - p.x) * k;
          p.vy += (gy - p.y) * k;

          const mx = p.x - mouse.x, my = p.y - mouse.y;
          const md = mx * mx + my * my;
          if (md < 11000) {
            const mdd = Math.sqrt(md) || 1;
            const f = (1 - md / 11000) * 3.2;
            p.vx += (mx / mdd) * f;
            p.vy += (my / mdd) * f;
          }

          p.vy -= scrollVel * 0.035 * (0.4 + p.r);
          p.vx += scrollVel * 0.012 * (p.r - 0.5);
          p.vx *= 0.84;
          p.vy *= 0.84;
          p.x += p.vx;
          p.y += p.vy;
        }
        scrollVel *= 0.82;

        ctx!.globalAlpha = (mobile ? 0.42 : 1) * (1 - sc * 0.55) * Math.min(1, 0.15 + ease);
        ctx!.fillStyle = '#EEE7D3';
        for (const p of parts) if (!p.g) ctx!.fillRect(p.x, p.y, pSize, pSize);
        ctx!.fillStyle = '#C9BA88';
        for (const p of parts) if (p.g) ctx!.fillRect(p.x, p.y, pSize, pSize);
        ctx!.globalAlpha = 1;
      }

      if (running && visible && !reduce) raf = requestAnimationFrame(frame);
    }

    function startLoop() {
      if (!running && !reduce && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }

    function stopLoop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onScroll() {
      const y = window.scrollY;
      scrollY0 = y;
      scrollVel += y - lastScrollY;
      lastScrollY = y;
    }

    function onPointerMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }
    function onPointerDown(e: PointerEvent) {
      if (reduce || (e.target instanceof Element && e.target.closest('a, button'))) return;
      const r = canvas!.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      for (const p of parts) {
        const dx = p.x - x;
        const dy = p.y - y;
        const distance = Math.hypot(dx, dy) || 1;
        const force = Math.max(0, 1 - distance / 520) * 26 + Math.random() * 4;
        p.vx += (dx / distance) * force;
        p.vy += (dy / distance) * force;
      }
      if (!running && visible) startLoop();
    }
    function onResize() {
      size();
      if (reduce) requestAnimationFrame(frame);
    }
    function onPointerLeave() { mouse.x = -9999; mouse.y = -9999; }

    size();
    raf = requestAnimationFrame(frame);
    logo.addEventListener('load', () => { if (reduce) requestAnimationFrame(frame); });

    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, { passive: true });
    hero.addEventListener('pointermove', onPointerMove as EventListener);
    hero.addEventListener('pointerdown', onPointerDown);
    hero.addEventListener('pointerleave', onPointerLeave);
    hero.addEventListener('pointerup', onPointerLeave);
    hero.addEventListener('pointercancel', onPointerLeave);

    const onVis = () => { if (document.hidden) stopLoop(); else startLoop(); };
    document.addEventListener('visibilitychange', onVis);

    let io: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        visible = entries[0]!.isIntersecting;
        if (visible) startLoop(); else stopLoop();
      });
      io.observe(hero);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      hero.removeEventListener('pointermove', onPointerMove as EventListener);
      hero.removeEventListener('pointerdown', onPointerDown);
      hero.removeEventListener('pointerleave', onPointerLeave);
      hero.removeEventListener('pointerup', onPointerLeave);
      hero.removeEventListener('pointercancel', onPointerLeave);
      document.removeEventListener('visibilitychange', onVis);
      io?.disconnect();
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
