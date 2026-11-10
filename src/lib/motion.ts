'use client';
/**
 * Shared motion singletons. Import from client components only.
 *   import { gsap, ScrollTrigger, useGSAP, prefersReduced, getLenis } from '@/lib/motion';
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type Lenis from 'lenis';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger, useGSAP);

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenisInstance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { lenisInstance = l; };
export const getLenis = () => lenisInstance;

export { gsap, ScrollTrigger, useGSAP };
