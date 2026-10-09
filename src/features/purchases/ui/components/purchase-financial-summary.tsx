'use client';

import { useMemo } from 'react';
import { Divider, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';

import { usePrivacyCurrency } from '@/lib/hooks/use-privacy-currency';
import { IPurchaseItem } from '../../domain/types';
import {
  calculateBuyRate,
  calculateEstimatedSellTotal,
  calculateReferenceTotal,
  calculateTotal,
} from '../../domain/purchases.domain';

interface PurchaseFinancialSummaryProps {
  items: IPurchaseItem[];
}

export default function PurchaseFinancialSummary({
  items,
}: PurchaseFinancialSummaryProps) {
  const displayCurrency = usePrivacyCurrency();

  const buyTotal = useMemo(() => calculateTotal(items), [items]);
  const referenceTotal = useMemo(() => calculateReferenceTotal(items), [items]);
  const estimatedSellTotal = useMemo(
    () => calculateEstimatedSellTotal(items),
    [items]
  );
  const buyRate = useMemo(() => calculateBuyRate(items), [items]);

  const profitTotal = useMemo(
    () => estimatedSellTotal - buyTotal,
    [estimatedSellTotal, buyTotal]
  );
  const profitMargin = useMemo(
    () => (buyTotal > 0 ? (profitTotal / buyTotal) * 100 : 0),
    [profitTotal, buyTotal]
  );

  const buyRateColor =
    buyRate === null
      ? ''
      : buyRate <= 65
        ? 'text-success'
        : buyRate <= 80
          ? 'text-warning'
          : 'text-danger';

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-2'>
        <Icon icon='lucide:trending-up' width={18} className='text-accent' />
        <span className='text-sm font-semibold'>Resumen financiero</span>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <div className='bg-default-50 flex flex-1 flex-col gap-1 rounded-lg p-4'>
          <span className='text-default-500 text-xs'>Total compra</span>
          <span className='text-accent text-lg font-bold'>
            {displayCurrency(buyTotal)}
          </span>
        </div>
        <div className='bg-default-50 flex flex-1 flex-col gap-1 rounded-lg p-4'>
          <span className='text-default-500 text-xs'>Valor mercado</span>
          <span className='text-default-900 text-lg font-bold'>
            {displayCurrency(referenceTotal)}
          </span>
        </div>
        <div className='bg-default-50 flex flex-1 flex-col gap-1 rounded-lg p-4'>
          <span className='text-default-500 flex items-center gap-1 text-xs'>
            Venta estimada
            <Tooltip
              content='Suma del precio de venta definido en cada item o, si aún no se define, el precio público sugerido (referencia +20%)'
              size='sm'
            >
              <span className='text-default-300 cursor-help'>
                <Icon icon='lucide:info' width={12} />
              </span>
            </Tooltip>
          </span>
          <span className='text-success text-lg font-bold'>
            {displayCurrency(estimatedSellTotal)}
          </span>
        </div>
        <div className='bg-default-50 flex flex-1 flex-col gap-1 rounded-lg p-4'>
          <span className='text-default-500 text-xs'>Ganancia estimada</span>
          <div className='flex items-center gap-2'>
            <span
              className={`text-lg font-bold ${
                profitTotal >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {profitTotal >= 0 ? '+' : '-'}
              {displayCurrency(Math.abs(profitTotal))}
            </span>
            <span
              className={`text-xs ${
                profitTotal >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              ({profitMargin.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {buyRate !== null && (
        <>
          <Divider />
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Icon
                icon='lucide:percent'
                width={16}
                className='text-default-400'
              />
              <span className='text-default-500 text-sm'>
                Tasa de compra sobre mercado
              </span>
              <Tooltip
                content='Qué porcentaje del valor de mercado estás pagando por estas cartas. Por ejemplo, 60% significa pagar $60 por cada $100 que valen según el precio de referencia. Objetivo: ~60%'
                size='sm'
              >
                <span className='text-default-300 cursor-help'>
                  <Icon icon='lucide:info' width={14} />
                </span>
              </Tooltip>
            </div>
            <span className={`text-sm font-semibold ${buyRateColor}`}>
              {buyRate.toFixed(1)}%
            </span>
          </div>
        </>
      )}
    </div>
  );
}
