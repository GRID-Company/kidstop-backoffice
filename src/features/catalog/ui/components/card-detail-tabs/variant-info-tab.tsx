'use client';

import { Icon } from '@iconify/react';

interface VariantInfoTabProps {
  stock: number;
  purchasePrice: number | null;
  sellPrice: number | null;
  marketPrices?: {
    ungradedPrice?: number | null;
    gradedPriceSeven?: number | null;
    priceRetail?: number | null;
    priceBuy?: number | null;
  };
  wishlistMetrics?: {
    total: number;
    variant: number;
  };
  additionalMetrics?: {
    lastSellDate?: number | null;
    avgDaysInInventory?: number | null;
  };
}

export default function VariantInfoTab({
  stock,
  purchasePrice,
  sellPrice,
  marketPrices,
  wishlistMetrics,
  additionalMetrics,
}: VariantInfoTabProps) {
  const margin =
    purchasePrice !== null && sellPrice !== null
      ? sellPrice - purchasePrice
      : null;
  const marginPercent =
    margin !== null && purchasePrice !== null && purchasePrice > 0
      ? ((margin / purchasePrice) * 100).toFixed(1)
      : null;

  const priceDiff =
    sellPrice !== null &&
    marketPrices?.ungradedPrice !== null &&
    marketPrices?.ungradedPrice !== undefined
      ? sellPrice - marketPrices.ungradedPrice
      : null;

  return (
    <div
      className='mx-auto flex max-w-4xl flex-col gap-6'
      data-testid='tab-info'
    >
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-2'>
        <div className='border-default-200 rounded-lg border bg-white p-4'>
          <div className='mb-2 flex items-start gap-2'>
            <Icon
              icon='lucide:package'
              className='text-default-400 shrink-0 text-lg'
            />
            <span className='text-default-500 text-xs leading-tight'>
              Stock disponible
            </span>
          </div>
          <div className='text-xl font-bold'>{stock}</div>
        </div>

        <div className='border-default-200 rounded-lg border bg-white p-4'>
          <div className='mb-2 flex items-start gap-2'>
            <Icon
              icon='lucide:tag'
              className='text-default-400 shrink-0 text-lg'
            />
            <span className='text-default-500 text-xs leading-tight'>
              Precio de venta
            </span>
          </div>
          <div className='text-xl font-bold'>
            {sellPrice !== null ? `$${sellPrice.toFixed(2)}` : '—'}
          </div>
        </div>

        {margin !== null && (
          <div className='border-default-200 rounded-lg border bg-white p-4'>
            <div className='mb-2 flex items-start justify-between gap-2'>
              <div className='flex items-start gap-2'>
                <Icon
                  icon={
                    margin >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'
                  }
                  className='text-default-400 shrink-0 text-lg'
                />
                <span className='text-default-500 text-xs leading-tight'>
                  Margen
                </span>
              </div>
              {marginPercent && (
                <span className='text-default-500 text-end text-xs leading-tight'>
                  ({marginPercent}%)
                </span>
              )}
            </div>
            <div className='text-xl font-bold'>
              ${Math.abs(margin).toFixed(2)}
            </div>
          </div>
        )}

        {wishlistMetrics && (
          <div className='border-default-200 rounded-lg border bg-white p-4'>
            <div className='mb-2 flex items-start gap-2'>
              <Icon
                icon='lucide:heart'
                className='text-default-400 shrink-0 text-lg'
              />
              <span className='text-default-500 text-xs leading-tight'>
                Wishlist
              </span>
            </div>
            <div className='text-xl font-bold'>{wishlistMetrics.variant}</div>
          </div>
        )}
      </div>

      {marketPrices && (
        <div className='bg-default-50 border-default-200 rounded-xl border p-5'>
          <h5 className='mb-4 flex items-center gap-2 text-sm font-semibold'>
            <Icon icon='lucide:bar-chart-3' className='text-lg' />
            Comparación con mercado
          </h5>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='border-default-200 flex items-center justify-between rounded-lg border bg-white p-3'>
              <div>
                <div className='text-default-500 mb-1 text-xs'>
                  Precio mercado (Ungraded)
                </div>
                <div className='text-accent text-xl font-bold'>
                  {marketPrices.ungradedPrice !== null &&
                  marketPrices.ungradedPrice !== undefined
                    ? `$${marketPrices.ungradedPrice.toFixed(2)}`
                    : 'N/A'}
                </div>
              </div>
              {priceDiff !== null && (
                <div
                  className={`rounded-full px-3 py-1 text-sm font-medium ${
                    priceDiff > 0
                      ? 'bg-green-100 text-green-700'
                      : priceDiff < 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-default-100 text-default-700'
                  }`}
                >
                  {priceDiff > 0 ? '+' : ''}${priceDiff.toFixed(2)}
                </div>
              )}
            </div>

            <div className='border-default-200 flex items-center justify-between rounded-lg border bg-white p-3'>
              <div>
                <div className='text-default-500 mb-1 text-xs'>
                  Precio PSA 7
                </div>
                <div className='text-xl font-bold text-blue-600'>
                  {marketPrices.gradedPriceSeven !== null &&
                  marketPrices.gradedPriceSeven !== undefined
                    ? `$${marketPrices.gradedPriceSeven.toFixed(2)}`
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3'>
        <div className='border-default-200 rounded-lg border bg-white p-4'>
          <div className='mb-2 flex items-start gap-2'>
            <Icon
              icon='lucide:shopping-cart'
              className='text-default-400 shrink-0 text-lg'
            />
            <span className='text-default-500 text-xs leading-tight'>
              Precio de compra
            </span>
          </div>
          <div className='text-xl font-bold'>
            {purchasePrice !== null ? `$${purchasePrice.toFixed(2)}` : '—'}
          </div>
        </div>

        <div className='border-default-200 rounded-lg border bg-white p-4'>
          <div className='mb-2 flex items-start gap-2'>
            <Icon
              icon='lucide:calendar'
              className='text-default-400 shrink-0 text-lg'
            />
            <span className='text-default-500 text-xs leading-tight'>
              Última venta
            </span>
          </div>
          <div className='text-xl font-bold'>
            {additionalMetrics?.lastSellDate
              ? new Date(additionalMetrics.lastSellDate).toLocaleDateString()
              : '—'}
          </div>
        </div>

        <div className='border-default-200 rounded-lg border bg-white p-4'>
          <div className='mb-2 flex items-start gap-2'>
            <Icon
              icon='lucide:clock'
              className='text-default-400 shrink-0 text-lg'
            />
            <span className='text-default-500 text-xs leading-tight'>
              Días en inventario
            </span>
          </div>
          <div className='text-xl font-bold'>
            {additionalMetrics?.avgDaysInInventory ?? '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
