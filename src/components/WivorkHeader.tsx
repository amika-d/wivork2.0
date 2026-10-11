import { useState } from 'react';

const contact = 'https://wa.me/94722227440';
const links = [
  { key: 'creations', href: '/#collection', label: 'Our creations' },
  { key: 'process', href: '/process', label: 'How it’s made' },
  { key: 'packages', href: '/packages', label: 'Packages' },
];

export default function WivorkHeader({ current, light = false }: { current?: 'process' | 'packages'; light?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className={`wk-header home-header process-header${light ? ' is-light' : ''}`}>
    <a className="wk-logo" href="/" aria-label="wivorK home"><img src="/wivork/logo.png" alt="wivorK" width="154" height="18"/></a>
    <nav className={menuOpen ? 'wk-nav open' : 'wk-nav'} aria-label="Main navigation">
      {links.map((link) => <a key={link.key} href={link.href} aria-current={link.key === current ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
    </nav>
    <a className="wk-contact" href={contact} target="_blank" rel="noreferrer">Let’s create <span>↗</span></a>
    <button className="wk-menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}</button>
  </header>;
}
