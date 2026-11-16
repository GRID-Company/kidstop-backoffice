import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { TIMEOUTS } from '../../support/consts/timeouts.const';

const VIEWPORT_OFFSET_VAR = '--visual-viewport-offset-top';
const POKEMON_MODAL = '[data-testid="pokemon-card-detail-modal"]';
const OVERLAY_WRAPPER = '[data-slot="wrapper"]';

interface VisualViewportStub {
  original: VisualViewport | null;
  state: { offsetTop: number; pageTop: number };
}

const ensureViewportStub = (win: Window): VisualViewportStub => {
  const cypressWin = win as Window & { __vvStub?: VisualViewportStub };
  if (cypressWin.__vvStub) return cypressWin.__vvStub;

  const original = win.visualViewport;
  const state = { offsetTop: 0, pageTop: 0 };
  const fake = new EventTarget();

  Object.defineProperties(fake, {
    height: { get: () => win.innerHeight },
    width: { get: () => win.innerWidth },
    offsetTop: { get: () => state.offsetTop },
    offsetLeft: { value: 0 },
    pageTop: { get: () => state.pageTop },
    pageLeft: { value: 0 },
    scale: { value: 1 },
  });

  Object.defineProperty(win, 'visualViewport', {
    value: fake,
    configurable: true,
  });

  cypressWin.__vvStub = { original, state };
  return cypressWin.__vvStub;
};

const computedTranslate = ($el: JQuery<HTMLElement>) => {
  const view = $el[0].ownerDocument.defaultView;
  return view ? view.getComputedStyle($el[0]).translate : 'none';
};

const dispatchViewportEvents = (
  win: Window,
  stub: VisualViewportStub
): void => {
  stub.original?.dispatchEvent(new Event('scroll'));
  stub.original?.dispatchEvent(new Event('resize'));
  win.dispatchEvent(new Event('scroll'));
};

When('el visual viewport se desplaza {string} píxeles', (pixels: string) => {
  cy.window().then((win) => {
    const stub = ensureViewportStub(win);
    const offset = Number(pixels);
    stub.state.offsetTop = offset;
    stub.state.pageTop = offset + win.scrollY;
    dispatchViewportEvents(win, stub);
  });
});

When('el documento se desplaza {string} píxeles', (pixels: string) => {
  cy.window().then((win) => {
    const stub = ensureViewportStub(win);
    stub.state.offsetTop = 0;
    stub.state.pageTop = Number(pixels);
    dispatchViewportEvents(win, stub);
  });
});

When('el documento intenta desplazarse {string} píxeles', (pixels: string) => {
  cy.window().then((win) => {
    const scrollingElement =
      win.document.scrollingElement ?? win.document.documentElement;
    scrollingElement.scrollTop = Number(pixels);
    win.dispatchEvent(new Event('scroll'));
  });
});

Then('el scroll del documento vuelve a {string} píxeles', (pixels: string) => {
  cy.document().its('documentElement.scrollTop').should('eq', Number(pixels));
});

Then('la variable CSS del offset del viewport es {string}', (value: string) => {
  cy.document()
    .its('documentElement')
    .then((el) => {
      expect(el.style.getPropertyValue(VIEWPORT_OFFSET_VAR).trim()).to.eq(
        value
      );
    });
});

Then(
  'el wrapper del overlay tiene un translate de {string} píxeles',
  (pixels: string) => {
    cy.get(POKEMON_MODAL, { timeout: TIMEOUTS.MODAL_OPEN })
      .closest(OVERLAY_WRAPPER)
      .then(($wrapper) => {
        expect(computedTranslate($wrapper)).to.include(`${pixels}px`);
      });
  }
);

Then(
  'el backdrop del overlay tiene un translate de {string} píxeles',
  (pixels: string) => {
    cy.get(POKEMON_MODAL, { timeout: TIMEOUTS.MODAL_OPEN })
      .closest(OVERLAY_WRAPPER)
      .prev()
      .then(($backdrop) => {
        expect(computedTranslate($backdrop)).to.include(`${pixels}px`);
      });
  }
);
