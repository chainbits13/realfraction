import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * Counts up from 0 to target when the element enters the viewport.
 */
export function AnimatedCounter({ target, suffix = "", duration = 1.5, className = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const endVal = Number(target) || 0;

    const tick = (now) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * endVal));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, target, duration]);

  return (
    <motion.span ref={ref} className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {count.toLocaleString()}{suffix}
    </motion.span>
  );
}
