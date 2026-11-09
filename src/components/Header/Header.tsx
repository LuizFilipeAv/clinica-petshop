'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Logo from '@/components/Logo/Logo';
import { getLenis } from '@/lib/motion';
import s from './Header.module.css';

const links = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#clinica', label: 'A clínica' },
  { href: '#petshop', label: 'Petshop' },
  { href: '#depoimentos', label: 'Depoimentos' },
];
const menuLinks = [...links, { href: '#contato', label: 'Contato' }];

const Arrow = () => (
  <span className="btn__arrow" aria-hidden="true">
    <svg viewBox="0 0 10 10"><path d="M0 5.6h7.6L4.1 9.1 5 10l5-5-5-5-.9.9 3.5 3.5H0z" fill="currentColor" /></svg>
  </span>
);

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // keeps the menu in the DOM during its close animation
  const burger = useRef<HTMLButtonElement>(null);

  // solid bar + logo once the hero wordmark scrolls under the header
  useEffect(() => {
    const mark = document.querySelector('[data-hero-mark]');
    if (!mark) { setSolid(true); return; }
    const io = new IntersectionObserver(([e]) => setSolid(!e.isIntersecting), { rootMargin: '-90px 0px 0px 0px' });
    io.observe(mark);
    return () => io.disconnect();
  }, []);

  const toggle = useCallback((next: boolean) => {
    setOpen(next);
    if (next) { setMounted(true); getLenis()?.stop(); } else getLenis()?.start();
  }, []);

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setMounted(false), 650);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { toggle(false); burger.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, toggle]);

  // two frames after mounting, add the open class so the clip-path transition runs
  const [anim, setAnim] = useState(false);
  useEffect(() => {
    if (!open) { setAnim(false); return; }
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setAnim(true)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [open]);

  return (
    <header className={`${s.hdr} ${solid ? s['is-solid'] : ''}`}>
      <div className={s.hdr__bar}>
        <nav className={s.hdr__nav} aria-label="Principal">
          <ul>
            {links.map((l) => <li key={l.href}><a href={l.href}>{l.label}</a></li>)}
          </ul>
        </nav>

        <a href="#top" className={s.hdr__logo} aria-label="Bigode, voltar ao início"><Logo /></a>

        <div className={s.hdr__end}>
          <a className={`btn ${s.hdr__cta}`} href="#contato" data-magnetic="">Agendar <Arrow /></a>
          <button
            ref={burger}
            className={s.hdr__burger}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => toggle(!open)}
          >
            <span className="visually-hidden">{open ? 'Fechar menu' : 'Abrir menu'}</span>
            <span className={s.hdr__lines} aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>

      <div
        className={`${s.menu} ${anim ? s['is-open'] : ''}`}
        id="menu"
        hidden={!mounted}
        onClick={(e) => { if ((e.target as HTMLElement).closest('a')) toggle(false); }}
      >
        <ul>
          {menuLinks.map((l, i) => (
            <li key={l.href} style={{ ['--i' as string]: i }}><a href={l.href} className="display">{l.label}</a></li>
          ))}
        </ul>
        <p className={s.menu__foot}>Emergência 24h · (11) 3000-0000</p>
      </div>
    </header>
  );
}
