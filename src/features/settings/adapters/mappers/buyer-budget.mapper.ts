import { BuyerBudgetsQuery } from '@/lib/api/generated/buyer-budgets.generated';
import { IBudgetConfig } from '../../domain/types';
import { BudgetFormData } from '../forms/budget-settings.schema';

export function fromApiBudgets(
  api: BuyerBudgetsQuery['buyerBudgets']
): IBudgetConfig[] {
  return api.map((item) => ({
    guid: item.guid,
    tcg: item.tcg,
    assignedAmount: item.assignedAmount,
    usedAmount: item.usedAmount,
    utilization: item.utilization,
    buyer: {
      guid: item.buyer.guid,
      name: item.buyer.name ?? '',
      emailAddress: item.buyer.emailAddress,
    },
  }));
}

export function toUpdateBuyerBudgetPayload(form: BudgetFormData) {
  return {
    updateBuyerBudgetInput: {
      buyerGuid: form.buyerGuid,
      tcg: form.tcg,
      assignedAmount: form.assignedAmount,
    },
  };
}
