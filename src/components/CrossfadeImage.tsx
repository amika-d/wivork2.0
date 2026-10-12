import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export default function CrossfadeImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  const [picture, setPicture] = useState({ src, alt });
  const reduced = useReducedMotion();
  useEffect(() => {
    let cancelled = false;
    const next = new Image();
    next.onload = () => {
      next.decode().catch(() => {}).then(() => {
        if (!cancelled) setPicture({ src, alt });
      });
    };
    next.src = src;
    return () => { cancelled = true; };
  }, [src, alt]);
  return <AnimatePresence initial={false}>
    <motion.img key={picture.src} src={picture.src} alt={picture.alt} width="1672" height="941"
      fetchPriority={priority ? 'high' : 'auto'} decoding="async"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : .65, ease: 'easeInOut' }} />
  </AnimatePresence>;
}
