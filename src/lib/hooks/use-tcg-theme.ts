'use client';

import { useEffect } from 'react';
import { useSelectedTCGStore } from '../store/selected-tcg';
import { TCG_THEMES } from '../consts/tcg-themes';

export function useTcgTheme() {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);

  useEffect(() => {
    const theme = TCG_THEMES[selectedTCG];
    const root = document.documentElement;

    root.style.setProperty('--tcg-sidebar-bg', theme.sidebarBg);
    root.style.setProperty('--tcg-sidebar-active', theme.sidebarActive);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-page-bg', theme.pageBg);
  }, [selectedTCG]);
}
