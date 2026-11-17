'use client';

import { useEffect, useState } from 'react';

const MAX_EVENTS = 9;

const describeEl = (el: Element | null): string => {
  if (!el || !(el instanceof HTMLElement)) return 'unknown';
  const slot = el.getAttribute('data-slot');
  const role = el.getAttribute('role');
  const cls = (el.className?.toString() ?? '').split(' ')[0];
  return `${el.tagName.toLowerCase()}${slot ? `[${slot}]` : ''}${role ? `[${role}]` : ''}${cls ? `.${cls}` : ''}`;
};

const ViewportDebugHud = () => {
  const [enabled, setEnabled] = useState(false);
  const [metrics, setMetrics] = useState('');
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('debugViewport'))
      return;
    setEnabled(true);

    const stamp = () => new Date().toISOString().slice(17, 23);
    const log = (msg: string) =>
      setEvents((prev) => [...prev.slice(-MAX_EVENTS), `${stamp()} ${msg}`]);

    const update = () => {
      const vv = window.visualViewport;
      const de = document.documentElement;
      const scrolled: string[] = [];
      document
        .querySelectorAll<HTMLElement>(
          '[role="dialog"], [data-slot="wrapper"], [data-slot="body"]'
        )
        .forEach((el) => {
          if (el.scrollTop > 0)
            scrolled.push(`${describeEl(el)}=${Math.round(el.scrollTop)}`);
        });
      setMetrics(
        `vv ot=${vv?.offsetTop.toFixed(0)} h=${vv?.height.toFixed(0)} pt=${vv?.pageTop.toFixed(0)} sc=${vv?.scale}\n` +
          `doc sy=${window.scrollY.toFixed(0)} st=${de.scrollTop} body=${document.body.scrollTop}\n` +
          `scrolled: ${scrolled.join(' | ') || 'none'}`
      );
    };

    const onScroll = (e: Event) => {
      const t = e.target;
      if (t === document) {
        log(`scroll:doc st=${document.documentElement.scrollTop}`);
      } else if (t instanceof HTMLElement) {
        log(`scroll:${describeEl(t)} st=${Math.round(t.scrollTop)}`);
      }
      update();
    };
    const onVvScroll = () => {
      log(`vv.scroll ot=${window.visualViewport?.offsetTop.toFixed(0)}`);
      update();
    };
    const onVvResize = () => {
      log(`vv.resize h=${window.visualViewport?.height.toFixed(0)}`);
      update();
    };
    const onFocus = (e: FocusEvent) =>
      log(`focus:${describeEl(e.target as Element)}`);

    const vv = window.visualViewport;
    document.addEventListener('scroll', onScroll, true);
    vv?.addEventListener('scroll', onVvScroll);
    vv?.addEventListener('resize', onVvResize);
    window.addEventListener('focusin', onFocus, true);
    window.addEventListener('resize', update);
    const interval = window.setInterval(update, 250);
    update();

    return () => {
      document.removeEventListener('scroll', onScroll, true);
      vv?.removeEventListener('scroll', onVvScroll);
      vv?.removeEventListener('resize', onVvResize);
      window.removeEventListener('focusin', onFocus, true);
      window.removeEventListener('resize', update);
      window.clearInterval(interval);
    };
  }, []);

  if (!enabled) return null;

  return (
    <pre className='pointer-events-none fixed top-2 left-2 z-[99999] max-w-[95vw] rounded bg-black/80 p-2 font-mono text-[10px] leading-tight whitespace-pre-wrap text-lime-300'>
      {metrics}
      {'\n'}
      {events.join('\n')}
    </pre>
  );
};

export default ViewportDebugHud;
