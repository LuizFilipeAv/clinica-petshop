/**
 * Motion core — shared by every section.
 *
 * Declarative API (use attributes in markup, no per-section JS needed):
 *   data-reveal="up|fade|scale|clip"   one-shot entrance when 15% visible
 *   data-stagger                       on a parent: children with data-reveal get --i index
 *   data-split                         heading words rise from a mask
 *   data-draw                          on <svg> or <path>: hand-drawn stroke draws in
 *   data-parallax="0.15"               scrubbed vertical drift (fraction of element height)
 *   data-count="1200"                  number counts up when visible (data-suffix optional)
 *   data-magnetic                      element leans toward the pointer
 *   data-cursor="Arraste"              custom cursor shows this label while hovering
 *
 * Everything respects prefers-reduced-motion and runs on transform/opacity/clip-path only.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export let lenis: Lenis | null = null;

/* ---------- Smooth scroll ---------- */
function initScroll() {
  if (reduced) return;
  lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 4), wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    const id = a.getAttribute('href')!;
    const target = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
    if (!target) return;
    e.preventDefault();
    lenis!.scrollTo(target, { offset: -80 });
    history.replaceState(null, '', id);
  });
}

/* ---------- Split headings into masked words ---------- */
function splitWords(el: HTMLElement) {
  let w = 0;
  const walk = (node: Node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent!.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) return frag.append(document.createTextNode(' '));
          const outer = document.createElement('span');
          outer.className = 'split-word';
          const inner = document.createElement('span');
          inner.style.setProperty('--w', String(w++));
          inner.textContent = p;
          outer.append(inner);
          frag.append(outer);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE && !(child as Element).matches('br, svg')) {
        walk(child);
      }
    });
  };
  el.setAttribute('aria-label', el.textContent!.replace(/\s+/g, ' ').trim());
  walk(el);
  el.querySelectorAll('.split-word').forEach((s) => s.setAttribute('aria-hidden', 'true'));
}

/* ---------- Count-up ---------- */
function countUp(el: HTMLElement) {
  const end = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? '';
  const fmt = new Intl.NumberFormat('pt-BR');
  if (reduced) { el.textContent = fmt.format(end) + suffix; return; }
  const obj = { v: 0 };
  gsap.to(obj, {
    v: end, duration: 1.6, ease: 'expo.out',
    onUpdate: () => { el.textContent = fmt.format(Math.round(obj.v)) + suffix; },
  });
}

/* ---------- One-shot visibility observer ---------- */
function initReveals(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-stagger]').forEach((parent) => {
    parent.querySelectorAll<HTMLElement>(':scope [data-reveal]').forEach((c, i) => c.style.setProperty('--i', String(i)));
  });
  root.querySelectorAll<HTMLElement>('[data-split]').forEach(splitWords);
  root.querySelectorAll<SVGPathElement>('[data-draw] path, path[data-draw]').forEach((p, i) => {
    const len = Math.ceil(p.getTotalLength());
    p.style.setProperty('--len', String(len));
    if (!p.style.getPropertyValue('--i')) p.style.setProperty('--i', String(i % 6));
  });

  const targets = root.querySelectorAll<HTMLElement>('[data-reveal], [data-split], [data-draw], [data-count]');
  if (reduced) {
    targets.forEach((t) => { t.classList.add('is-in'); if (t.dataset.count) countUp(t); });
    return;
  }
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target as HTMLElement;
      el.classList.add('is-in');
      if (el.dataset.count) countUp(el);
      io.unobserve(el);
    }),
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );
  targets.forEach((t) => io.observe(t));
}

/* ---------- Parallax ---------- */
function initParallax() {
  if (reduced) return;
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    const amt = parseFloat(el.dataset.parallax || '0.15') * 100;
    gsap.fromTo(el, { yPercent: amt }, {
      yPercent: -amt, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/* ---------- Magnetic ---------- */
function initMagnetic() {
  if (reduced || !finePointer) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.3);
      y((e.clientY - r.top - r.height / 2) * 0.3);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

/* ---------- Cursor follower ---------- */
function initCursor() {
  if (reduced || !finePointer) return;
  const c = document.createElement('div');
  c.className = 'cursor';
  c.setAttribute('aria-hidden', 'true');
  c.innerHTML = '<span class="cursor__label"></span>';
  document.body.append(c);
  const label = c.firstElementChild as HTMLElement;
  const xTo = gsap.quickTo(c, 'x', { duration: 0.45, ease: 'power3.out' });
  const yTo = gsap.quickTo(c, 'y', { duration: 0.45, ease: 'power3.out' });
  let shown = false;
  window.addEventListener('pointermove', (e) => {
    if (!shown) { gsap.set(c, { x: e.clientX, y: e.clientY }); shown = true; c.classList.add('is-on'); }
    xTo(e.clientX); yTo(e.clientY);
    const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor], a, button');
    const text = t?.dataset.cursor ?? '';
    c.classList.toggle('is-label', !!text);
    c.classList.toggle('is-link', !!t && !text);
    if (text && label.textContent !== text) label.textContent = text;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => c.classList.remove('is-on'));
  document.documentElement.addEventListener('pointerenter', () => c.classList.add('is-on'));
}

export function initMotion() {
  initScroll();
  initReveals();
  initParallax();
  initMagnetic();
  initCursor();
  // fonts change line boxes; refresh triggers once they're in
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger };
