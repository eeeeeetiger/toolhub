'use client';

import { useEffect, useRef, useState } from 'react';

export default function SignatureMakerClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * c.width, y: ((e.clientY - rect.top) / rect.height) * c.height };
  }

  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    last.current = pos(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current!.x, last.current!.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    setHasInk(true);
  }

  function up() {
    drawing.current = false;
    last.current = null;
  }

  function clear() {
    const c = canvasRef.current!;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, c.width, c.height);
    setHasInk(false);
  }

  function download() {
    const c = canvasRef.current!;
    const url = c.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'signature.png';
    a.click();
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">Sign with your mouse or finger below, then download a transparent-background PNG.</p>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerLeave={up}
        className="w-full touch-none rounded-xl border-2 border-slate-200 bg-white"
      />
      <div className="flex gap-3">
        <button
          type="button"
          onClick={clear}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-red-300 hover:text-red-600"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={download}
          disabled={!hasInk}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand/90 disabled:opacity-50"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
