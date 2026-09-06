import { RefObject, useEffect } from 'react';

/**
 * Hook para implementar focus trap en modales y diálogos
 * Cumple con WCAG 2.1 Nivel A - 2.4.3 Focus Order
 *
 * @param ref - Referencia al elemento contenedor del modal
 * @param isActive - Si el trap está activo (opcional, default: true)
 *
 * @example
 * ```tsx
 * const dialogRef = useRef<HTMLDivElement>(null);
 * useFocusTrap(dialogRef);
 *
 * return (
 *   <div ref={dialogRef} role="dialog" aria-modal="true">
 *     <button>Cerrar</button>
 *   </div>
 * );
 * ```
 */
export const useFocusTrap = (
  ref: RefObject<HTMLElement>,
  isActive: boolean = true
) => {
  useEffect(() => {
    if (!ref.current || !isActive) return;

    const element = ref.current;
    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusableElements = () => {
      return Array.from(
        element.querySelectorAll<HTMLElement>(focusableSelector)
      );
    };

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  }, [ref, isActive]);
};
