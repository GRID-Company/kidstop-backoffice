import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PurchaseCardChipsPage from './purchase-card-chips.po';
import { PurchaseCardChipsSelectors } from './purchase-card-chips.selectors';

const purchase = new PurchaseCardChipsPage();

const chipSelector = (chip: string): string => {
  switch (chip) {
    case '✧ Foil':
      return PurchaseCardChipsSelectors.chipFoil;
    case 'Non-Foil':
      return PurchaseCardChipsSelectors.chipNonFoil;
    case 'Reverse Holo':
      return PurchaseCardChipsSelectors.chipVariant;
    case 'idioma':
      return PurchaseCardChipsSelectors.chipLanguage;
    default:
      return `[data-testid="card-chip-${chip}"]`;
  }
};

Given('la búsqueda de compras responde con cartas Magic foil y no foil', () => {
  purchase.stubAuxQueries();
  purchase.stubCardSearch(
    'MagicCardInternalList',
    'purchases/magic-internal-list-foil-pair.json'
  );
  purchase.visitNew('MAGIC');
});

Given(
  'la búsqueda de compras responde con cartas Pokémon con variantes',
  () => {
    purchase.stubAuxQueries();
    purchase.stubCardSearch(
      'PokemonCardInternalList',
      'purchases/pokemon-internal-list-variant.json'
    );
    purchase.visitNew('POKEMON');
  }
);

Given('la búsqueda masiva responde con cartas Magic foil y no foil', () => {
  purchase.stubAuxQueries();
  purchase.stubCardSearch(
    'MagicBatchCardSearch',
    'purchases/magic-batch-search-foil.json'
  );
  purchase.visitNew('MAGIC');
});

Given('la compra guardada responde con items Magic foil y no foil', () => {
  purchase.stubAuxQueries();
  purchase.stubPurchaseDetail('purchases/purchase-magic-foil.json');
});

Given('el usuario confirma el vendedor stub', () => {
  purchase.confirmFirstSeller();
});

When('el usuario busca {string} en la compra', (query: string) => {
  purchase.searchCard(query);
});

When('el usuario activa la búsqueda avanzada', () => {
  purchase.enableAdvancedSearch();
});

When('busca la lista {string} en búsqueda masiva', (listText: string) => {
  purchase.submitBulkList(listText);
});

When('el usuario visita la compra guardada', () => {
  purchase.visitSavedPurchase('purchase-cypress-1');
});

Then(
  'el resultado de búsqueda {int} debería mostrar el chip {string}',
  (index: number, chip: string) => {
    purchase.shouldSeeResultChips(
      PurchaseCardChipsSelectors.resultItem,
      index - 1,
      [chipSelector(chip)]
    );
  }
);

Then(
  'el resultado de búsqueda {int} debería mostrar chips de tipo, HP y etapa',
  (index: number) => {
    purchase.shouldSeeResultChips(
      PurchaseCardChipsSelectors.resultItem,
      index - 1,
      [
        PurchaseCardChipsSelectors.chipType,
        PurchaseCardChipsSelectors.chipHp,
        PurchaseCardChipsSelectors.chipStage,
      ]
    );
  }
);

Then(
  'el resultado de búsqueda {int} debería mostrar el chip de idioma',
  (index: number) => {
    purchase.shouldSeeResultChips(
      PurchaseCardChipsSelectors.resultItem,
      index - 1,
      [PurchaseCardChipsSelectors.chipLanguage]
    );
  }
);

Then(
  'el mejor resultado masivo debería mostrar el chip {string}',
  (chip: string) => {
    purchase.shouldSeeResultChips(
      PurchaseCardChipsSelectors.bulkResultSummary,
      0,
      [chipSelector(chip)]
    );
  }
);

Then(
  'la carta relacionada {int} debería mostrar el chip {string}',
  (index: number, chip: string) => {
    purchase.expandResult(0);
    purchase.shouldSeeResultChips(
      PurchaseCardChipsSelectors.bulkRelatedOption,
      index - 1,
      [chipSelector(chip)]
    );
  }
);

Then(
  'el item guardado {int} debería mostrar el chip {string}',
  (index: number, chip: string) => {
    purchase.shouldSeeResultChips(
      PurchaseCardChipsSelectors.purchaseItemCard,
      index - 1,
      [chipSelector(chip)]
    );
  }
);

Then(
  'el item guardado {int} debería mostrar el chip de idioma',
  (index: number) => {
    purchase.shouldSeeResultChips(
      PurchaseCardChipsSelectors.purchaseItemCard,
      index - 1,
      [PurchaseCardChipsSelectors.chipLanguage]
    );
  }
);
