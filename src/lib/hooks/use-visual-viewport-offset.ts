import { useEffect } from 'react';

export const VISUAL_VIEWPORT_OFFSET_VAR = '--visual-viewport-offset-top';
export const VISUAL_VIEWPORT_HEIGHT_VAR = '--vv-height';
export const VISUAL_VIEWPORT_FULL_VAR = '--vv-full';
export const VISUAL_VIEWPORT_STRIP_VAR = '--vv-strip';

export function useVisualViewportOffset(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const root = document.documentElement;
    const update = () => {
      const viewport = window.visualViewport;
      const offsetTop = Math.max(0, viewport?.offsetTop ?? 0);
      const bandHeight = viewport?.height ?? window.innerHeight;
      const fullHeight = window.innerHeight - offsetTop;
      const strip = Math.max(0, fullHeight - bandHeight);
      const footerInset = bandHeight < window.innerHeight * 0.8 ? strip : 0;
      root.style.setProperty(VISUAL_VIEWPORT_OFFSET_VAR, `${offsetTop}px`);
      root.style.setProperty(VISUAL_VIEWPORT_HEIGHT_VAR, `${bandHeight}px`);
      root.style.setProperty(VISUAL_VIEWPORT_FULL_VAR, `${fullHeight}px`);
      root.style.setProperty(VISUAL_VIEWPORT_STRIP_VAR, `${footerInset}px`);

      const viewportShifted = offsetTop > 0 || bandHeight < window.innerHeight;
      if (viewportShifted) {
        const scrollingElement = document.scrollingElement;
        if (
          scrollingElement &&
          scrollingElement.scrollTop !== 0 &&
          document.querySelector('[role="dialog"]')
        ) {
          scrollingElement.scrollTop = 0;
        }

        document
          .querySelectorAll<HTMLElement>(
            '[role="dialog"], [data-slot="wrapper"]'
          )
          .forEach((el) => {
            if (el.scrollTop !== 0) el.scrollTop = 0;
          });
      }
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
      root.style.removeProperty(VISUAL_VIEWPORT_FULL_VAR);
      root.style.removeProperty(VISUAL_VIEWPORT_STRIP_VAR);
    };
  }, [enabled]);
}
