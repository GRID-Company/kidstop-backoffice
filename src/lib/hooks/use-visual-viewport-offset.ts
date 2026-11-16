import { useEffect } from 'react';

export const VISUAL_VIEWPORT_OFFSET_VAR = '--visual-viewport-offset-top';

export function useVisualViewportOffset(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const root = document.documentElement;
    const update = () => {
      root.style.setProperty(
        VISUAL_VIEWPORT_OFFSET_VAR,
        `${window.visualViewport?.offsetTop ?? 0}px`
      );
    };

    update();
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', update);
    viewport?.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    return () => {
      viewport?.removeEventListener('resize', update);
      viewport?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      root.style.removeProperty(VISUAL_VIEWPORT_OFFSET_VAR);
    };
  }, [enabled]);
}
