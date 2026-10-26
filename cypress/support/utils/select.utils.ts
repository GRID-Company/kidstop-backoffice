import { TIMEOUTS } from '../consts/timeouts.const';

// HeroUI/React Aria selects: synthetic clicks don't fire press in Electron — open via Alt+ArrowDown and pick with focus+Enter.
// Selecting an already-selected option toggles it off (empty keys -> invalid), so skip when the value is already set.
export const selectHeroUIOption = (
  triggerSelector: string,
  optionLabel: string
) => {
  const triggerSelectorCombined = `${triggerSelector}[data-slot="trigger"], ${triggerSelector} [data-slot="trigger"]`;

  cy.get(triggerSelectorCombined)
    .first()
    .then(($trigger) => {
      if ($trigger.text().trim().includes(optionLabel)) return;

      cy.wrap($trigger).focus().type('{alt}{downArrow}');
      cy.get('[role="listbox"]', { timeout: TIMEOUTS.DROPDOWN_OPEN }).should(
        'be.visible'
      );
      cy.contains('[role="option"]', optionLabel).focus().type('{enter}');
    });
};
