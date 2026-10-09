import { useEffect, useRef } from 'react';
import logoUrl from '@/assets/logo-mark.png';

interface P {
  x: number; y: number;
  vx: number; vy: number;
  tx: number; ty: number;
  sx: number; sy: number;
  hx: number; hy: number;
  k: number; g: boolean; r: number;
}

interface Props {
  /** 1 = Consult, 2 = Design, 3 = Build */
  shape: number;
  /** Per-chapter assembly progress, matching the chapter shapes. */
  activity: readonly number[];
  reduce: boolean;
}

export default function ServicesCanvas({ shape, activity, reduce }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    parts: [] as P[],
    shapes: [] as number[][][],
    shape: -1,
    activity: [0, 0, 0] as readonly number[],
    requestedShape: 1,
    assembly: 0,
    mouse: { x: -999, y: -999 },
    W: 0,
    H: 0,
    raf: 0,
    running: false,
    visible: false,
    syncStatic: null as (() => void) | null,
  });

  // Keep shape + assemble in a ref so the RAF loop reads fresh values
  useEffect(() => {
    const state = stateRef.current;
    state.requestedShape = shape;
    state.activity = activity;
    if (reduce) state.syncStatic?.();
  }, [shape, activity, reduce]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const S = stateRef.current;
    const logo = new Image();
    logo.src = logoUrl;

    function samplePts(draw: (c: CanvasRenderingContext2D, w: number, h: number) => void): number[][] {
      const w = Math.round(S.W);
      const h = Math.round(S.H);
      if (w < 20 || h < 20) return [];
      const o = document.createElement('canvas');
      o.width = w;
      o.height = h;
      const c = o.getContext('2d');
      if (!c) return [];
      c.strokeStyle = '#fff';
      c.fillStyle = '#fff';
      c.lineCap = 'round';
      c.lineJoin = 'round';
      draw(c, w, h);

      let d: Uint8ClampedArray;
      try {
        d = c.getImageData(0, 0, w, h).data;
      } catch {
        return [];
      }

      const pts: number[][] = [];
      const gap = Math.max(3, Math.round(w / 95));
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          if (d[(y * w + x) * 4 + 3]! > 120) pts.push([x, y]);
        }
      }
      for (let i = pts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pts[i], pts[j]] = [pts[j]!, pts[i]!];
      }
      return pts;
    }

    function rrect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
      c.stroke();
    }

    function buildShapes() {
      const r = canvas!.getBoundingClientRect();
      if (r.width < 20) return;
      S.W = r.width;
      S.H = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = S.W * dpr;
      canvas!.height = S.H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const lw = S.W * 0.065;

      S.shapes = [
        // 0: logo
        samplePts((c, w, h) => {
          if (!logo.naturalWidth) return;
          const iw = w * 0.92;
          const ih = (iw * logo.naturalHeight) / logo.naturalWidth;
          c.drawImage(logo, (w - iw) / 2, (h - ih) / 2, iw, ih);
        }),
        // 1: consult chart
        samplePts((c, w, h) => {
          c.lineWidth = lw * 0.7;
          c.beginPath();
          c.moveTo(w * 0.12, h * 0.12);
          c.lineTo(w * 0.12, h * 0.86);
          c.lineTo(w * 0.9, h * 0.86);
          c.stroke();
          c.lineWidth = lw;
          c.beginPath();
          c.moveTo(w * 0.22, h * 0.7);
          c.lineTo(w * 0.42, h * 0.48);
          c.lineTo(w * 0.57, h * 0.6);
          c.lineTo(w * 0.84, h * 0.26);
          c.stroke();
          c.beginPath();
          c.moveTo(w * 0.66, h * 0.25);
          c.lineTo(w * 0.85, h * 0.25);
          c.lineTo(w * 0.85, h * 0.44);
          c.stroke();
        }),
        // 2: design diagram
        samplePts((c, w, h) => {
          c.lineWidth = lw * 0.8;
          rrect(c, w * 0.08, h * 0.1, w * 0.34, h * 0.24, w * 0.04);
          rrect(c, w * 0.58, h * 0.1, w * 0.34, h * 0.24, w * 0.04);
          rrect(c, w * 0.33, h * 0.64, w * 0.34, h * 0.24, w * 0.04);
          c.lineWidth = lw * 0.55;
          c.beginPath();
          c.moveTo(w * 0.25, h * 0.34);
          c.lineTo(w * 0.25, h * 0.49);
          c.lineTo(w * 0.75, h * 0.49);
          c.lineTo(w * 0.75, h * 0.34);
          c.moveTo(w * 0.5, h * 0.49);
          c.lineTo(w * 0.5, h * 0.64);
          c.stroke();
        }),
        // 3: build code
        samplePts((c, w, h) => {
          c.font = `800 ${Math.round(w * 0.4)}px Poppins, sans-serif`;
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillText('</>', w / 2, h * 0.53);
        }),
      ];

      const N = Math.min(
        Math.max(...S.shapes.map((a) => a.length), 400),
        1500
      );

      while (S.parts.length < N) {
        S.parts.push({
          x: Math.random() * S.W, y: Math.random() * S.H,
          vx: 0, vy: 0,
          tx: S.W / 2, ty: S.H / 2,
          sx: Math.random() * S.W, sy: Math.random() * S.H,
          hx: 0, hy: 0,
          k: 0.04 + Math.random() * 0.05,
          g: Math.random() < 0.24,
          r: Math.random(),
        });
      }
      S.parts.length = N;
      S.parts.forEach((p) => {
        p.sx = Math.random() * S.W;
        p.sy = Math.random() * S.H;
        p.hx = p.sx;
        p.hy = p.sy;
      });

      S.shape = -1;
      if (reduce) S.assembly = 1;
      setShape(S.requestedShape);
      if (reduce) syncStatic();
    }

    function setShape(i: number) {
      if (i === S.shape || !S.shapes[i] || !S.shapes[i]!.length) return;
      S.shape = i;
      const pts = S.shapes[i]!;
      S.parts.forEach((p, j) => {
        const q = pts[j % pts.length]!;
        p.hx = q[0]! + (Math.random() - 0.5) * 1.2;
        p.hy = q[1]! + (Math.random() - 0.5) * 1.2;
      });
      kick();
    }

    function kick() {
      if (reduce) {
        S.parts.forEach((p) => { p.x = p.tx; p.y = p.ty; });
        draw();
      } else if (!S.running && S.visible) {
        S.running = true;
        S.raf = requestAnimationFrame(frame);
      }
    }

    function aimAll(t: number) {
      const e = S.assembly * S.assembly * (3 - 2 * S.assembly);
      const loose = 1 - e;
      for (const p of S.parts) {
        p.tx = p.sx + (p.hx - p.sx) * e + Math.sin(t * 0.6 + p.r * 9) * 8 * loose;
        p.ty = p.sy + (p.hy - p.sy) * e + Math.cos(t * 0.5 + p.r * 7) * 8 * loose;
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, S.W, S.H);
      const rad = Math.max(1.1, S.W / 230);
      ctx!.fillStyle = '#EEE7D3';
      ctx!.beginPath();
      for (const p of S.parts) if (!p.g) { ctx!.moveTo(p.x + rad, p.y); ctx!.arc(p.x, p.y, rad, 0, 6.2832); }
      ctx!.fill();
      ctx!.fillStyle = '#C9BA88';
      ctx!.beginPath();
      for (const p of S.parts) if (p.g) { ctx!.moveTo(p.x + rad, p.y); ctx!.arc(p.x, p.y, rad, 0, 6.2832); }
      ctx!.fill();
    }

    function syncStatic() {
      S.assembly = 1;
      if (S.shape !== S.requestedShape) setShape(S.requestedShape);
      aimAll(0);
      S.parts.forEach((p) => { p.x = p.tx; p.y = p.ty; });
      draw();
    }
    S.syncStatic = syncStatic;

    function frame(now: number) {
      const t = now / 1000;
      if (S.requestedShape !== S.shape && S.assembly < 0.12) setShape(S.requestedShape);
      const target = S.shape > 0 ? (S.activity[S.shape - 1] ?? 0) : 0;
      S.assembly += (target - S.assembly) * 0.09;
      aimAll(t);
      for (const p of S.parts) {
        p.vx += (p.tx - p.x) * p.k;
        p.vy += (p.ty - p.y) * p.k;
        const mx = p.x - S.mouse.x, my = p.y - S.mouse.y;
        const md = mx * mx + my * my;
        if (md < 2600) {
          const mdd = Math.sqrt(md) || 1;
          const f = (1 - md / 2600) * 2.6;
          p.vx += (mx / mdd) * f;
          p.vy += (my / mdd) * f;
        }
        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;
      }
      draw();
      if (S.running && S.visible) S.raf = requestAnimationFrame(frame);
      else S.running = false;
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas!.getBoundingClientRect();
      S.mouse.x = e.clientX - r.left;
      S.mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { S.mouse.x = -999; S.mouse.y = -999; };

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerup', onLeave);
    canvas.addEventListener('pointercancel', onLeave);
    window.addEventListener('resize', buildShapes);
    logo.addEventListener('load', buildShapes);
    if (logo.complete) buildShapes();
    if (document.fonts?.ready) document.fonts.ready.then(buildShapes);

    let io: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        S.visible = entries[0]!.isIntersecting;
        if (S.visible && !S.running && !reduce) {
          S.running = true;
          S.raf = requestAnimationFrame(frame);
        }
      });
      io.observe(canvas);
    } else {
      S.visible = true;
    }

    return () => {
      S.running = false;
      cancelAnimationFrame(S.raf);
      S.syncStatic = null;
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerup', onLeave);
      canvas.removeEventListener('pointercancel', onLeave);
      window.removeEventListener('resize', buildShapes);
      io?.disconnect();
    };
  }, [reduce]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
