import { useEffect } from 'react';

export const VISUAL_VIEWPORT_OFFSET_VAR = '--visual-viewport-offset-top';
export const VISUAL_VIEWPORT_HEIGHT_VAR = '--vv-height';

export function useVisualViewportOffset(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const root = document.documentElement;
    const update = () => {
      const viewport = window.visualViewport;
      root.style.setProperty(
        VISUAL_VIEWPORT_OFFSET_VAR,
        `${Math.max(0, viewport?.offsetTop ?? 0)}px`
      );
      root.style.setProperty(
        VISUAL_VIEWPORT_HEIGHT_VAR,
        `${viewport?.height ?? window.innerHeight}px`
      );

      const scrollingElement = document.scrollingElement;
      if (
        scrollingElement &&
        scrollingElement.scrollTop !== 0 &&
        document.querySelector('[role="dialog"]')
      ) {
        scrollingElement.scrollTop = 0;
      }

      document
        .querySelectorAll<HTMLElement>('[role="dialog"], [data-slot="wrapper"]')
        .forEach((el) => {
          if (el.scrollTop !== 0) el.scrollTop = 0;
        });
    };

    update();
    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', update);
    viewport?.addEventListener('scroll', update);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('focusin', update);

    return () => {
      viewport?.removeEventListener('resize', update);
      viewport?.removeEventListener('scroll', update);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('focusin', update);
      root.style.removeProperty(VISUAL_VIEWPORT_OFFSET_VAR);
      root.style.removeProperty(VISUAL_VIEWPORT_HEIGHT_VAR);
    };
  }, [enabled]);
}
