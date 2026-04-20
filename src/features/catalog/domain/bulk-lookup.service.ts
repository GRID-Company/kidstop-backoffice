import { IBatchSearchResult, IPriceAnalysis, IPokemonCardMetricsResponse, IMagicCardMetricsResponse, IBatchMagicCard, IBatchPokemonCard } from './bulk-lookup.types';

export class BulkLookupService {
  static enrichWithMetrics(
    results: IBatchSearchResult[],
    metricsMap: Record<string, IPokemonCardMetricsResponse | IMagicCardMetricsResponse>
  ): IPriceAnalysis[] {
    return results
      .filter((result) => result.bestMatch)
      .flatMap((result) => {
        const card = result.bestMatch as IBatchMagicCard | IBatchPokemonCard;
        const metrics = metricsMap[card.guid];

        if (!metrics) {
          return [];
        }

        // If variantsMetrics is empty, create a single analysis entry with the market price
        if (!metrics.variantsMetrics || metrics.variantsMetrics.length === 0) {
          const currentPrice = card.sellPrice;
          const marketPrice = this.getMarketPrice(metrics);

          return [
            {
              guid: `${card.guid}-ungraded`,
              cardGuid: card.guid,
              cardName: card.name,
              currentPrice,
              suggestedPrice: card.sellPrice,
              marketPrice,
              margin: marketPrice && currentPrice ? marketPrice - currentPrice : null,
              marginPercentage:
                marketPrice && currentPrice ? ((marketPrice - currentPrice) / currentPrice) * 100 : null,
              condition: 'Ungraded',
              quantity: card.totalStock,
            },
          ];
        }

        return metrics.variantsMetrics.map((variant) => {
          const currentPrice = this.getCurrentPrice(card, variant.condition);
          const suggestedPrice = card.sellPrice;
          const marketPrice = this.getMarketPrice(metrics);

          return {
            guid: `${card.guid}-${variant.condition}`,
            cardGuid: card.guid,
            cardName: card.name,
            currentPrice,
            suggestedPrice,
            marketPrice,
            margin: marketPrice && currentPrice ? marketPrice - currentPrice : null,
            marginPercentage:
              marketPrice && currentPrice ? ((marketPrice - currentPrice) / currentPrice) * 100 : null,
            condition: variant.condition,
            quantity: variant.stock,
          };
        });
      });
  }

  private static getCurrentPrice(card: IBatchMagicCard | IBatchPokemonCard, condition: string): number | null {
    const variant = card.inventoryCards?.find((v) => v.condition === condition);
    return variant?.sellPrice ?? null;
  }

  private static getMarketPrice(
    metrics: IPokemonCardMetricsResponse | IMagicCardMetricsResponse
  ): number | null {
    if ('priceRetail' in metrics) {
      return metrics.priceRetail;
    }
    if ('ungradedPrice' in metrics) {
      return metrics.ungradedPrice;
    }
    return null;
  }

  static calculateMarginPercentage(currentPrice: number, marketPrice: number): number {
    if (currentPrice === 0) return 0;
    return ((marketPrice - currentPrice) / currentPrice) * 100;
  }

  static validateBulkLoadItems(items: any[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!items || items.length === 0) {
      errors.push('No items selected for bulk load');
    }

    items.forEach((item, index) => {
      if (!item.cardGuid) {
        errors.push(`Item ${index + 1}: Missing card GUID`);
      }
      if (!item.condition) {
        errors.push(`Item ${index + 1}: Missing condition`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Invalid quantity`);
      }
      if (item.sellPrice < 0) {
        errors.push(`Item ${index + 1}: Invalid sell price`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
