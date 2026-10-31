'use client';

import PokemonTypeIcon from '@/shared/components/pokemon-type-icon';
import { getHighestQualityImage } from '@/lib/utils/image-utils';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { TCG_TYPES } from '@/lib/types/tcg.types';
import { IPokemonCard } from '../../domain/types';
import {
  getMinStockedPurchasePrice,
  summarizeConditionStock,
} from '../../domain/catalog.domain';
import CatalogCardItem, { CatalogCardChip } from './catalog-card-item';

interface PokemonCardGridItemProps {
  card: IPokemonCard;
  showCosts?: boolean;
  onPress?: (card: IPokemonCard) => void;
}

export default function PokemonCardGridItem({
  card,
  showCosts,
  onPress,
}: PokemonCardGridItemProps) {
  const imageSrc =
    getHighestQualityImage(card.moreImages)?.imageUrl ?? card.imageUri;

  const conditionSummary = summarizeConditionStock(card.variants);

  const metaChips: CatalogCardChip[] = [];
  if (card.variant) {
    metaChips.push({ label: card.variant, accent: true });
  }
  if (card.language) {
    metaChips.push({ label: LANGUAGE_LABELS[card.language] });
  }

  const attrChips: CatalogCardChip[] = [];
  if (card.type) {
    attrChips.push({
      label: card.type,
      icon: <PokemonTypeIcon type={card.type} size='sm' />,
    });
  }
  if (card.hp) {
    attrChips.push({ label: `HP ${card.hp}` });
  }

  return (
    <CatalogCardItem
      tcgType={TCG_TYPES.POKEMON}
      imageSrc={imageSrc}
      name={card.name}
      number={card.cardNumber}
      ident={card.setCode}
      subtitle={card.setName}
      chipRows={[metaChips, attrChips]}
      available={card.availableStock}
      priceLabel={
        conditionSummary.length > 1 ? 'Desde · venta' : 'Precio de venta'
      }
      price={card.sellPrice}
      stock={card.totalStock}
      conditionSummary={conditionSummary}
      costPrice={getMinStockedPurchasePrice(card.variants)}
      showCosts={showCosts}
      onDetail={onPress ? () => onPress(card) : undefined}
      testId='pokemon-card'
    />
  );
}
