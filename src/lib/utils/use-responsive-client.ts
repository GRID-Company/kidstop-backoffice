'use client';

import { createBreakpoint } from 'react-use';

type BP = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const BREAKPOINTS: Record<BP, number> = {
  base: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const ORDER: BP[] = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];

const useTWBreakpoint = createBreakpoint(BREAKPOINTS);

export function useResponsiveClient() {
  const bp = useTWBreakpoint() as BP;
  const safeBp: BP = (ORDER.includes(bp) ? bp : 'base') as BP;
  const idx = ORDER.indexOf(safeBp);

  const is = (name: BP) => safeBp === name;
  const bpUpEqualThan = (name: BP) => idx >= ORDER.indexOf(name);
  const bpDownEqualThan = (name: BP) => idx <= ORDER.indexOf(name);
  const betweenBp = (min: BP, max: BP) =>
    idx >= ORDER.indexOf(min) && idx <= ORDER.indexOf(max);

  return { bp: safeBp, is, bpUpEqualThan, bpDownEqualThan, betweenBp };
}
