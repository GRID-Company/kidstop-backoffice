'use client';

import { Button, Chip, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { formatCurrency } from '@/lib/utils/format-currency';
import { CARD_CONDITION_SHORT_LABELS } from '../../../domain/constants';
import { CardCondition } from '../../../domain/types';
import { LANGUAGE_LABELS } from '@/lib/types/language.types';
import { CardLanguage } from '@/lib/api/schema-types';

export interface MarketReferencePrice {
  label: string;
  value: number | null;
}

export interface MarketVariantMetric {
  condition: string;
  language: CardLanguage;
  stock: number;
  wishlistCount?: number | null;
  avgDaysInInventory?: number | null;
  lastSellDate?: string | number | null;
}

interface MarketTabProps {
  providerName: string;
  referencePrices: MarketReferencePrice[];
  variantMetrics: MarketVariantMetric[];
  loading: boolean;
  requested: boolean;
  error?: boolean;
  onRequest: () => void;
}

export default function MarketTab({
  providerName,
  referencePrices,
  variantMetrics,
  loading,
  requested,
  error,
  onRequest,
}: MarketTabProps) {
  if (!requested) {
    return (
      <div
        className='border-default-200 flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center'
        data-testid='market-tab-idle'
      >
        <Icon icon='lucide:line-chart' className='text-default-300 text-3xl' />
        <p className='text-default-500 max-w-sm text-sm'>
          Los precios de referencia se consultan a {providerName} solo cuando lo
          necesitas, para mantener el catálogo rápido.
        </p>
        <Button
          size='sm'
          onPress={onRequest}
          startContent={<Icon icon='lucide:refresh-ccw' />}
          className='bg-accent text-white'
          data-testid='load-market-prices-button'
        >
          Consultar precios de referencia
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className='flex items-center justify-center gap-2 p-10'
        data-testid='market-tab-loading'
      >
        <Spinner size='sm' />
        <span className='text-default-500 text-sm'>
          Consultando {providerName}…
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className='border-danger-200 bg-danger-50 flex flex-col items-center gap-3 rounded-xl border p-8 text-center'
        data-testid='market-tab-error'
      >
        <Icon icon='lucide:alert-triangle' className='text-danger text-2xl' />
        <p className='text-danger-600 text-sm'>
          No se pudieron obtener los precios de referencia.
        </p>
        <Button
          size='sm'
          variant='flat'
          color='danger'
          onPress={onRequest}
          data-testid='retry-market-prices-button'
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4' data-testid='market-tab-content'>
      <div className='border-default-200 rounded-xl border bg-white p-4'>
        <h5 className='text-default-500 mb-3 flex items-center gap-2 text-xs font-semibold tracking-wide uppercase'>
          <Icon icon='lucide:store' className='text-accent text-sm' />
          Referencia {providerName}
        </h5>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
          {referencePrices.map((price) => (
            <div key={price.label} className='flex flex-col gap-0.5'>
              <span className='text-default-400 text-[10px] tracking-wide uppercase'>
                {price.label}
              </span>
              <span className='text-default-800 text-base font-bold'>
                {price.value != null ? formatCurrency(price.value) : 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {variantMetrics.length > 0 && (
        <div className='border-default-200 overflow-hidden rounded-xl border bg-white'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-default-100 text-default-400 border-b text-[10px] tracking-wide uppercase'>
                <th className='px-3 py-2.5 font-medium'>Variante</th>
                <th className='px-3 py-2.5 text-right font-medium'>Stock</th>
                <th className='px-3 py-2.5 text-right font-medium'>Wishlist</th>
                <th className='px-3 py-2.5 text-right font-medium'>
                  Días inv.
                </th>
                <th className='px-3 py-2.5 text-right font-medium'>
                  Últ. venta
                </th>
              </tr>
            </thead>
            <tbody>
              {variantMetrics.map((metric) => (
                <tr
                  key={`${metric.condition}-${metric.language}`}
                  className='border-default-100 border-b last:border-0'
                >
                  <td className='px-3 py-2.5'>
                    <span className='flex items-center gap-1.5'>
                      <Chip size='sm' variant='flat' radius='sm'>
                        {
                          CARD_CONDITION_SHORT_LABELS[
                            metric.condition as CardCondition
                          ]
                        }
                      </Chip>
                      <span className='text-default-500 text-xs'>
                        {LANGUAGE_LABELS[metric.language] ?? metric.language}
                      </span>
                    </span>
                  </td>
                  <td className='px-3 py-2.5 text-right font-semibold'>
                    {metric.stock}
                  </td>
                  <td className='text-default-600 px-3 py-2.5 text-right'>
                    {metric.wishlistCount ?? '—'}
                  </td>
                  <td className='text-default-600 px-3 py-2.5 text-right'>
                    {metric.avgDaysInInventory ?? '—'}
                  </td>
                  <td className='text-default-600 px-3 py-2.5 text-right'>
                    {metric.lastSellDate
                      ? new Date(metric.lastSellDate).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
