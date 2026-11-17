import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { TIMEOUTS } from '../../support/consts/timeouts.const';

const VIEWPORT_OFFSET_VAR = '--visual-viewport-offset-top';
const POKEMON_MODAL = '[data-testid="pokemon-card-detail-modal"]';
const OVERLAY_WRAPPER = '[data-slot="wrapper"]';

interface VisualViewportStub {
  original: VisualViewport | null;
  state: { offsetTop: number; pageTop: number; height: number | null };
}

const ensureViewportStub = (win: Window): VisualViewportStub => {
  const cypressWin = win as Window & { __vvStub?: VisualViewportStub };
  if (cypressWin.__vvStub) return cypressWin.__vvStub;

  const original = win.visualViewport;
  const state = { offsetTop: 0, pageTop: 0, height: null };
  const fake = new EventTarget();

  Object.defineProperties(fake, {
    height: { get: () => state.height ?? win.innerHeight },
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

When(
  'el contenedor del drawer intenta desplazarse {string} píxeles',
  (pixels: string) => {
    cy.viewport(500, 400);
    cy.get(POKEMON_MODAL, { timeout: TIMEOUTS.MODAL_OPEN })
      .closest('[role="dialog"]')
      .then(($dialog) => {
        const dialog = $dialog[0];
        dialog.scrollTop = Number(pixels);
        if (dialog.parentElement)
          dialog.parentElement.scrollTop = Number(pixels);
        dialog.ownerDocument.defaultView?.dispatchEvent(new Event('scroll'));
      });
  }
);

Then(
  'el scroll del contenedor del drawer vuelve a {string} píxeles',
  (pixels: string) => {
    cy.get(POKEMON_MODAL)
      .closest('[role="dialog"]')
      .should(($dialog) => {
        expect($dialog[0].scrollTop).to.eq(Number(pixels));
      });
  }
);

Then('el wrapper del overlay no excede el área visible', () => {
  cy.get(POKEMON_MODAL)
    .closest('[role="dialog"]')
    .parent()
    .then(($wrapper) => {
      const rect = $wrapper[0].getBoundingClientRect();
      const viewportHeight =
        $wrapper[0].ownerDocument.defaultView?.innerHeight ?? 0;
      expect(rect.height, 'wrapper no excede el viewport').to.be.at.most(
        viewportHeight
      );
      expect($wrapper[0].scrollTop, 'wrapper sin scroll').to.eq(0);
    });
});

When('el visual viewport se encoge a {string} píxeles', (pixels: string) => {
  cy.viewport(500, 400);
  cy.window().then((win) => {
    const stub = ensureViewportStub(win);
    stub.state.height = Number(pixels);
    stub.state.offsetTop = 0;
    stub.state.pageTop = 0;
    dispatchViewportEvents(win, stub);
  });
});

Then('el drawer cubre toda la pantalla', () => {
  cy.get(POKEMON_MODAL, { timeout: TIMEOUTS.MODAL_OPEN })
    .closest('[role="dialog"]')
    .then(($dialog) => {
      const rect = $dialog[0].getBoundingClientRect();
      const innerHeight =
        $dialog[0].ownerDocument.defaultView?.innerHeight ?? 0;
      expect(Math.round(rect.height)).to.eq(innerHeight);
    });
});

Then('el cuerpo del drawer cubre la zona del teclado', () => {
  cy.get(POKEMON_MODAL)
    .closest('[role="dialog"]')
    .find('.flex-1.overflow-y-auto')
    .then(($body) => {
      const rect = $body[0].getBoundingClientRect();
      const innerHeight = $body[0].ownerDocument.defaultView?.innerHeight ?? 0;
      expect(Math.round(rect.bottom)).to.eq(innerHeight);
    });
});

Then('el footer del drawer queda sobre la banda visible', () => {
  cy.get(`${POKEMON_MODAL} [data-testid="close-modal-button"]`)
    .parent()
    .then(($footer) => {
      const rect = $footer[0].getBoundingClientRect();
      const bandHeight =
        $footer[0].ownerDocument.defaultView?.visualViewport?.height ?? 0;
      expect(Math.round(rect.bottom)).to.eq(bandHeight);
    });
});

Then('el footer del drawer permanece dentro del área visible', () => {
  cy.get(`${POKEMON_MODAL} [data-testid="close-modal-button"]`)
    .parent()
    .then(($footer) => {
      const rect = $footer[0].getBoundingClientRect();
      const viewportHeight =
        $footer[0].ownerDocument.defaultView?.innerHeight ?? 0;
      expect(rect.height, 'footer tiene altura').to.be.greaterThan(0);
      expect(rect.bottom, 'footer dentro del viewport').to.be.at.most(
        viewportHeight
      );
    });
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
