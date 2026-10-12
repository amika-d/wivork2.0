export default function SlidePagination({ labels, selected, onSelect, playing }: { labels: string[]; selected: number; onSelect: (index: number) => void; playing: boolean }) {
  return <div className="wk-slide-pagination" aria-label="Choose a slide">
    {labels.map((label, index) => <button type="button" key={label} aria-label={label} aria-pressed={selected === index} className={selected === index ? 'active' : ''} onClick={() => onSelect(index)}>
      <span className="wk-slide-indicator">{selected === index && <span key={`${selected}-${playing}`} className={`wk-slide-progress${playing ? ' is-playing' : ''}`}/>}</span>
    </button>)}
  </div>;
}
