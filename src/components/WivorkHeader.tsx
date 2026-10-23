import { useState } from 'react';
import '../styles/site.css';

const contact = 'https://wa.me/94722227440';
const links = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'creations', href: '/gallery', label: 'Our creations' },
  { key: 'process', href: '/process', label: 'How it’s made' },
  { key: 'packages', href: '/packages', label: 'Packages' },
];

export default function WivorkHeader({ current, theme = 'light' }: { current?: 'home' | 'creations' | 'process' | 'packages'; theme?: 'light' | 'dark' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="wk-header" data-theme={theme}>
    <a className="wk-logo" href="/" aria-label="wivork home"><img src="/wivork/logo.png" alt="wivork" width="154" height="18"/></a>
    <nav className={menuOpen ? 'wk-nav open' : 'wk-nav'} aria-label="Main navigation">
      {links.map((link) => <a key={link.key} href={link.href} aria-current={link.key === current ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
    </nav>
    <a className="wk-contact" href={contact} target="_blank" rel="noreferrer">Let’s create <span>↗</span></a>
    <button className="wk-menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}</button>
  </header>;
}
