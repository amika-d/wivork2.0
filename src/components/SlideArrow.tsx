export default function SlideArrow({ direction, onClick, label }: { direction: 'prev' | 'next'; onClick: () => void; label: string }) {
  return <button type="button" className={`wk-gallery-arrow wk-gallery-${direction}`} onClick={onClick} aria-label={label}>
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={direction === 'prev' ? { transform: 'scaleX(-1)' } : undefined}><path d="m2 2 8 8-8 8"/></svg>
  </button>;
}
