import { useEffect, useRef, useState, type FocusEvent } from 'react';

export function useSlideshow(count: number, delay = 5500) {
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(motion.matches);
    updateMotion();
    motion.addEventListener('change', updateMotion);
    const updateVisibility = () => setTabVisible(!document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      motion.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (paused || focused || reduced || !visible || !tabVisible) return;
    const timer = window.setTimeout(() => setSelected(value => (value + 1) % count), delay);
    return () => window.clearTimeout(timer);
  }, [selected, paused, focused, reduced, visible, tabVisible, count, delay]);

  return {
    selected, setSelected, paused, setPaused, reduced,
    playing: !paused && !focused && !reduced && visible && tabVisible,
    bindings: {
      ref,
      onFocus: (event: FocusEvent<HTMLDivElement>) => setFocused(event.target.matches(':focus-visible')),
      onBlur: (event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      },
    },
  };
}
