'use client';

import { useEffect, useRef, useState } from 'react';

/** La web siempre se anima, también con «reducir movimiento» en el sistema. */
export function useReducedMotion() {
  return false;
}

export function useCountUp(target: number, reduced: boolean) {
  const [value, setValue] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (reduced ? 90 : 460));
      current.current = from + (target - from) * (1 - (1 - t) ** 3);
      setValue(current.current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, reduced]);
  return Math.round(value * 100) / 100;
}
