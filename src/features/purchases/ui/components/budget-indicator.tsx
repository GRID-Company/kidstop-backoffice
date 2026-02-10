'use client';

import { useMemo } from 'react';
import { Card, CardBody, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';

import { usePrivacyModeStore } from '@/lib/store/privacy-mode';
import { formatCurrency } from '@/lib/utils/format-currency';
import { IPurchaseItem } from '../../domain/types';
import { checkBudget, BudgetCheckResult } from '../../domain/purchases.domain';
import { DEFAULT_BUDGET_LIMIT } from '../../domain/constants';

const REDACTED_VALUE = '$••••••';

interface BudgetIndicatorProps {
  items: IPurchaseItem[];
  currentSpent: number;
  budgetLimit?: number;
}

const getUsagePercentage = (result: BudgetCheckResult): number => {
  if (result.budgetLimit <= 0) return 0;
  const totalUsed = result.currentSpent + result.purchaseTotal;
  return Math.min((totalUsed / result.budgetLimit) * 100, 100);
};

const getSpentPercentage = (result: BudgetCheckResult): number => {
  if (result.budgetLimit <= 0) return 0;
  return Math.min((result.currentSpent / result.budgetLimit) * 100, 100);
};

type BudgetLevel = 'normal' | 'warning' | 'danger';

const getBudgetLevel = (percentage: number, withinBudget: boolean): BudgetLevel => {
  if (!withinBudget) return 'danger';
  if (percentage >= 80) return 'warning';
  return 'normal';
};

const LEVEL_CONFIG: Record<BudgetLevel, { icon: string; label: string; progressColor: 'success' | 'warning' | 'danger' }> = {
  normal: { icon: 'lucide:check-circle', label: 'Dentro del presupuesto', progressColor: 'success' },
  warning: { icon: 'lucide:alert-triangle', label: 'Cerca del límite', progressColor: 'warning' },
  danger: { icon: 'lucide:alert-circle', label: 'Excede presupuesto', progressColor: 'danger' },
};

export default function BudgetIndicator({
  items,
  currentSpent,
  budgetLimit = DEFAULT_BUDGET_LIMIT,
}: BudgetIndicatorProps) {
  const budgetResult = useMemo(
    () => checkBudget(items, currentSpent, budgetLimit),
    [items, currentSpent, budgetLimit]
  );

  const usagePercentage = useMemo(
    () => getUsagePercentage(budgetResult),
    [budgetResult]
  );

  const spentPercentage = useMemo(
    () => getSpentPercentage(budgetResult),
    [budgetResult]
  );

  const level = useMemo(
    () => getBudgetLevel(usagePercentage, budgetResult.withinBudget),
    [usagePercentage, budgetResult.withinBudget]
  );

  const { isPrivacyMode } = usePrivacyModeStore();

  const config = LEVEL_CONFIG[level];

  const displayCurrency = (value: number): string =>
    isPrivacyMode ? REDACTED_VALUE : formatCurrency(Math.abs(value));

  return (
    <Card
      className={
        level === 'danger'
          ? 'border-2 border-danger'
          : level === 'warning'
            ? 'border-2 border-warning'
            : ''
      }
    >
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon
              icon={config.icon}
              className={
                level === 'danger'
                  ? 'text-danger'
                  : level === 'warning'
                    ? 'text-warning'
                    : 'text-success'
              }
              width={20}
            />
            <span className="text-sm font-semibold">Presupuesto</span>
          </div>
          <span
            className={`text-sm font-medium ${
              level === 'danger'
                ? 'text-danger'
                : level === 'warning'
                  ? 'text-warning'
                  : 'text-success'
            }`}
          >
            {config.label}
          </span>
        </div>

        <Progress
          value={usagePercentage}
          color={config.progressColor}
          size="md"
          className="w-full"
          aria-label={`Uso de presupuesto: ${Math.round(usagePercentage)}%`}
        />

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="text-default-500">Asignado</span>
          <span className="text-right font-medium">
            {displayCurrency(budgetResult.budgetLimit)}
          </span>

          <span className="text-default-500">Gastado previamente</span>
          <span className="text-right font-medium">
            {displayCurrency(budgetResult.currentSpent)}{' '}
            {!isPrivacyMode && (
              <span className="text-default-400">({Math.round(spentPercentage)}%)</span>
            )}
          </span>

          <span className="text-default-500">Compra actual</span>
          <span
            className={`text-right font-medium ${
              level === 'danger' ? 'text-danger' : ''
            }`}
          >
            {displayCurrency(budgetResult.purchaseTotal)}
          </span>

          <span className="text-default-500">Restante</span>
          <span
            className={`text-right font-bold ${
              budgetResult.remaining < 0
                ? 'text-danger'
                : budgetResult.remaining === 0
                  ? 'text-warning'
                  : 'text-success'
            }`}
          >
            {!isPrivacyMode && budgetResult.remaining < 0 ? '-' : ''}
            {displayCurrency(budgetResult.remaining)}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
