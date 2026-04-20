import { IBatchSearchResult, IPriceAnalysis, IPokemonCardMetricsResponse, IMagicCardMetricsResponse } from './bulk-lookup.types';
import { IPokemonCard, IMagicCard } from './types';

export class BulkLookupService {
  static enrichWithMetrics(
    results: IBatchSearchResult[],
    metricsMap: Record<string, IPokemonCardMetricsResponse | IMagicCardMetricsResponse>
  ): IPriceAnalysis[] {
    return results
      .filter((result) => result.bestMatch)
      .flatMap((result) => {
        const card = result.bestMatch as IPokemonCard | IMagicCard;
        const metrics = metricsMap[card.guid];

        if (!metrics) {
          return [];
        }

        return metrics.variantsMetrics.map((variant) => {
          const currentPrice = this.getCurrentPrice(card, variant.condition);
          const suggestedPrice = card.sellPrice;
          const marketPrice = this.getMarketPrice(metrics);

          return {
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

  private static getCurrentPrice(card: IPokemonCard | IMagicCard, condition: string): number | null {
    const variant = card.variants.find((v) => v.condition === condition);
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
