import { InventoryItemsQuery, InventoryMovementsQuery } from '@/lib/api/generated/inventory.generated';
import { IInventoryItem, IInventoryMovement } from '../../domain/types';
import { STOCK_STATUSES } from '../../domain/constants';
import { InventoryAdjustmentFormData } from '../forms/inventory-adjustment.form.schema';

type ApiInventoryItem = NonNullable<NonNullable<InventoryItemsQuery['inventoryItems']['data']>[number]>;
type ApiInventoryMovement = NonNullable<NonNullable<InventoryMovementsQuery['inventoryMovements']['data']>[number]>;

export function fromApiInventoryItem(item: ApiInventoryItem): IInventoryItem {
  const isPokemon = !!item.pokemonCardSummary;
  const card = item.pokemonCardSummary ?? item.magicCardSummary;

  return {
    guid: item.guid,
    cardGuid: card?.guid ?? '',
    name: card?.name ?? '',
    setName: item.pokemonCardSummary?.setName ?? item.magicCardSummary?.edition ?? '',
    setCode: item.pokemonCardSummary?.setCode ?? '',
    number: item.pokemonCardSummary?.cardNumber ?? item.magicCardSummary?.collectorNumber ?? '',
    rarity: item.pokemonCardSummary?.rarity ?? item.magicCardSummary?.rarity ?? '',
    imageUrl: card?.imageUri ?? '',
    tcg: item.tcg,
    condition: item.condition as IInventoryItem['condition'],
    stock: item.stock,
    stockStatus: item.stock > 0 ? STOCK_STATUSES.AVAILABLE : STOCK_STATUSES.UNAVAILABLE,
    purchasePrice: item.purchasePrice ?? 0,
    sellPrice: item.sellPrice ?? 0,
    lastSellDate: item.lastSellDate ? String(item.lastSellDate) : null,
    avgDaysInInventory: item.avgDaysInInventory ?? null,
  };
}

export function fromApiInventoryMovement(movement: ApiInventoryMovement): IInventoryMovement {
  const { inventoryItem } = movement;
  const card = inventoryItem.pokemonCardSummary ?? inventoryItem.magicCardSummary;

  return {
    guid: movement.guid,
    inventoryItemGuid: inventoryItem.guid,
    cardName: card?.name ?? '',
    cardImageUrl: card?.imageUri ?? '',
    setName: inventoryItem.pokemonCardSummary?.setName ?? inventoryItem.magicCardSummary?.edition ?? '',
    setCode: inventoryItem.pokemonCardSummary?.setCode ?? '',
    cardNumber: inventoryItem.pokemonCardSummary?.cardNumber ?? inventoryItem.magicCardSummary?.collectorNumber ?? '',
    tcg: inventoryItem.tcg,
    movementType: movement.movementType as IInventoryMovement['movementType'],
    quantity: movement.quantity,
    notes: movement.notes,
    userName: movement.createdBy?.name ?? '',
    reference: movement.reference ?? null,
    createdDate: String(movement.createdDate),
  };
}

export function toAdjustInventoryPayload(data: InventoryAdjustmentFormData) {
  return {
    createInventoryMovementInput: {
      cardGuid: data.cardGuid,
      tcg: data.tcg,
      condition: data.condition,
      quantity: data.quantity,
      bulkOperationType: data.bulkOperationType as any,
      ...(data.notes && { notes: data.notes }),
    },
  };
}

export function toAdjustmentFormDefaults(
  item: IInventoryItem
): Partial<InventoryAdjustmentFormData> {
  return {
    cardGuid: item.cardGuid,
    tcg: item.tcg,
    condition: item.condition,
  };
}
