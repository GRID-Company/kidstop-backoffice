'use client';

import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { IMagicCard } from '../../domain/types';
import {
  getMinStockedPurchasePrice,
  summarizeConditionStock,
} from '../../domain/catalog.domain';
import CatalogCardItem, { CatalogCardChip } from './catalog-card-item';

interface MagicCardGridItemProps {
  card: IMagicCard;
  showCosts?: boolean;
  onPress: (card: IMagicCard) => void;
}

export default function MagicCardGridItem({
  card,
  showCosts,
  onPress,
}: MagicCardGridItemProps) {
  const conditionSummary = summarizeConditionStock(card.variants);

  const metaChips: CatalogCardChip[] = [
    {
      label: card.isFoil ? '✧ Foil' : 'Non-Foil',
      color: card.isFoil ? 'warning' : 'default',
      accent: !card.isFoil,
    },
  ];
  if (card.language) {
    metaChips.push({ label: LANGUAGE_LABELS[card.language] });
  }

  return (
    <CatalogCardItem
      tcgType={TCG_TYPES.MAGIC}
      imageSrc={card.imageUri}
      name={card.name}
      number={card.collectorNumber}
      subtitle={card.edition}
      chipRows={[metaChips]}
      available={card.availableStock}
      priceLabel={
        conditionSummary.length > 1 ? 'Desde · venta' : 'Precio de venta'
      }
      price={card.sellPrice}
      stock={card.totalStock}
      conditionSummary={conditionSummary}
      costPrice={getMinStockedPurchasePrice(card.variants)}
      showCosts={showCosts}
      onDetail={() => onPress(card)}
      testId='magic-card'
    />
  );
}
