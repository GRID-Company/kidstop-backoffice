import { IInventoryItem } from '../../domain/types';
import { InventoryAdjustmentFormData } from '../forms/inventory-adjustment.form.schema';

export function toAdjustInventoryPayload(data: InventoryAdjustmentFormData) {
  return {
    adjustInventoryInput: {
      inventoryItemId: data.inventoryItemId,
      condition: data.condition,
      quantity: data.quantity,
      movementType: data.movementType,
      notes: data.notes || undefined,
    },
  };
}

export function toAdjustmentFormDefaults(
  item: IInventoryItem
): Partial<InventoryAdjustmentFormData> {
  return {
    inventoryItemId: item.id,
    condition: item.condition,
  };
}
