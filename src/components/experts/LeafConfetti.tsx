import { useCallback, useEffect, useRef } from "react";

interface Leaf {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  speedX: number;
  speedY: number;
  rotationSpeed: number;
  color: string;
  shape: number;
  opacity: number;
}

const COLORS = ['#ED7660', '#E1B624', '#809482', '#19363B', '#5B8C3E', '#D4735E', '#C9A94E'];

const LeafConfetti = ({ active, duration = 4000 }: { active: boolean; duration?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leavesRef = useRef<Leaf[]>([]);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const createLeaf = useCallback((): Leaf => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 1,
    speedX: (Math.random() - 0.5) * 3,
    speedY: 1.5 + Math.random() * 3,
    rotationSpeed: (Math.random() - 0.5) * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: Math.floor(Math.random() * 3),
    opacity: 0.7 + Math.random() * 0.3,
  }), []);

  const drawLeaf = useCallback((ctx: CanvasRenderingContext2D, leaf: Leaf) => {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate((leaf.rotation * Math.PI) / 180);
    ctx.scale(leaf.scale, leaf.scale);
    ctx.globalAlpha = leaf.opacity;
    ctx.fillStyle = leaf.color;
    ctx.beginPath();

    if (leaf.shape === 0) {
      // Oval leaf
      ctx.ellipse(0, 0, 5, 10, 0, 0, Math.PI * 2);
    } else if (leaf.shape === 1) {
      // Pointed leaf
      ctx.moveTo(0, -12);
      ctx.bezierCurveTo(6, -6, 6, 6, 0, 12);
      ctx.bezierCurveTo(-6, 6, -6, -6, 0, -12);
    } else {
      // Maple-ish leaf
      ctx.moveTo(0, -10);
      ctx.lineTo(4, -4);
      ctx.lineTo(9, -5);
      ctx.lineTo(6, 0);
      ctx.lineTo(8, 5);
      ctx.lineTo(3, 3);
      ctx.lineTo(0, 10);
      ctx.lineTo(-3, 3);
      ctx.lineTo(-8, 5);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-9, -5);
      ctx.lineTo(-4, -4);
      ctx.closePath();
    }
    ctx.fill();

    // Leaf vein
    ctx.strokeStyle = leaf.color;
    ctx.globalAlpha = leaf.opacity * 0.3;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 8);
    ctx.stroke();

    ctx.restore();
  }, []);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create initial batch
    leavesRef.current = Array.from({ length: 80 }, createLeaf);
    startRef.current = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      leavesRef.current.forEach((leaf) => {
        leaf.x += leaf.speedX + Math.sin(elapsed / 500 + leaf.rotation) * 0.5;
        leaf.y += leaf.speedY;
        leaf.rotation += leaf.rotationSpeed;

        if (elapsed > duration * 0.6) {
          leaf.opacity *= 0.98;
        }

        drawLeaf(ctx, leaf);
      });

      leavesRef.current = leavesRef.current.filter(l => l.y < canvas.height + 20 && l.opacity > 0.01);

      if (elapsed < duration && leavesRef.current.length > 0) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, [active, createLeaf, drawLeaf, duration]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default LeafConfetti;
