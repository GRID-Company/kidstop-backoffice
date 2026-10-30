import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import CardScannerPage from './card-scanner.po';
import { CardScannerSelectors } from './card-scanner.selectors';
import PurchaseCardChipsPage from '../purchases/purchase-card-chips.po';

const scanner = new CardScannerPage();
const purchase = new PurchaseCardChipsPage();

Given('el escáner responde con cartas Magic foil y no foil', () => {
  scanner.stubAuxQueries();
  scanner.stubScanResults(
    'MagicCardScanSearch',
    'scanner/magic-scan-foil-pair.json'
  );
});

Given('el escáner responde con cartas Pokémon con variantes', () => {
  scanner.stubAuxQueries();
  scanner.stubScanResults(
    'PokemonCardScanSearch',
    'scanner/pokemon-scan-variant.json'
  );
});

Given('el usuario inicia una nueva compra con un vendedor stub', () => {
  purchase.stubAuxQueries();
  purchase.visitNew('MAGIC');
  purchase.confirmFirstSeller();
});

When(
  'el usuario abre el escáner desde el FAB con TCG {string}',
  (tcg: string) => {
    scanner.visitWithTcg('/catalogo', tcg === 'magic' ? 'MAGIC' : 'POKEMON');
    scanner.openFromFab();
  }
);

When('el usuario abre el escáner desde la compra', () => {
  scanner.openFromPurchase();
});

When('captura una carta con el modo IA', () => {
  scanner.enableAiMode();
  scanner.capture();
});

When('agrega el resultado del escáner {int} a la compra', (index: number) => {
  scanner.addResultToPurchase(index - 1);
});

Then(
  'el resultado del escáner {int} debería mostrar el chip {string}',
  (index: number, chip: string) => {
    const chipSelector =
      chip === '✧ Foil'
        ? CardScannerSelectors.chipFoil
        : chip === 'Non-Foil'
          ? CardScannerSelectors.chipNonFoil
          : chip === 'Reverse Holo'
            ? CardScannerSelectors.chipVariant
            : `[data-testid="card-chip-${chip}"]`;

    scanner.shouldSeeResultChips(
      CardScannerSelectors.bulkResultSummary,
      index - 1,
      [chipSelector]
    );
  }
);

Then(
  'el resultado del escáner {int} debería mostrar chips de tipo, HP y etapa',
  (index: number) => {
    scanner.shouldSeeResultChips(
      CardScannerSelectors.bulkResultSummary,
      index - 1,
      [
        CardScannerSelectors.chipType,
        CardScannerSelectors.chipHp,
        CardScannerSelectors.chipStage,
      ]
    );
  }
);

Then(
  'el resultado de compra del escáner {int} debería mostrar el chip {string}',
  (index: number, chip: string) => {
    const chipSelector =
      chip === '✧ Foil'
        ? CardScannerSelectors.chipFoil
        : CardScannerSelectors.chipNonFoil;

    scanner.shouldSeeResultChips(CardScannerSelectors.resultItem, index - 1, [
      chipSelector,
    ]);
  }
);

Then('el item agregado debería mostrar el chip {string}', (chip: string) => {
  const chipSelector =
    chip === '✧ Foil'
      ? CardScannerSelectors.chipFoil
      : chip === 'Non-Foil'
        ? CardScannerSelectors.chipNonFoil
        : CardScannerSelectors.chipLanguage;

  scanner.shouldSeePurchaseItemChips([chipSelector]);
});

Then('el item agregado debería mostrar el chip de idioma', () => {
  scanner.shouldSeePurchaseItemChips([CardScannerSelectors.chipLanguage]);
});
