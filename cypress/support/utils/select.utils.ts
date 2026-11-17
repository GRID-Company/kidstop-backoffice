import { TIMEOUTS } from '../consts/timeouts.const';

// HeroUI/React Aria selects: synthetic clicks don't reliably fire press in Electron,
// so retry once with a forced click when the trigger stayed closed. Options are
// picked via focus+Enter since the same press issue applies to option clicks.
export const pickHeroUIOption = (
  $trigger: JQuery<HTMLElement>,
  optionLabel: string
) => {
  cy.wrap($trigger).click();
  cy.wait(TIMEOUTS.ANIMATION);
  cy.wrap($trigger).then(($el) => {
    if ($el.attr('data-open') !== 'true') {
      cy.wrap($el).click({ force: true });
    }
  });
  cy.get('[role="listbox"]', { timeout: TIMEOUTS.DROPDOWN_OPEN }).should(
    'be.visible'
  );
  cy.contains('[role="option"]', optionLabel).focus().type('{enter}');
};

export const selectHeroUIOption = (
  triggerSelector: string,
  optionLabel: string
) => {
  const triggerSelectorCombined = `${triggerSelector}[data-slot="trigger"], ${triggerSelector} [data-slot="trigger"]`;

  cy.get(triggerSelectorCombined, { timeout: TIMEOUTS.DROPDOWN_OPEN })
    .first()
    .then(($trigger) => {
      if ($trigger.text().trim() === optionLabel) return;
      pickHeroUIOption($trigger, optionLabel);
    });
};
