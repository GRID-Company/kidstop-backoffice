import { IPurchaseItem } from '../../domain/types';
import { PurchaseItemFormData } from '../forms/use-purchase-items-form';

export const mapFormItemToPurchaseItem = (
  formItem: PurchaseItemFormData,
  originalItem?: IPurchaseItem
): Partial<IPurchaseItem> => ({
  cardGuid: formItem.cardGuid,
  condition: formItem.condition,
  quantity: formItem.quantity,
  offerPrice: formItem.offerPrice,
  referencePrice: formItem.referencePrice,
  ...(originalItem && {
    guid: originalItem.guid,
    cardName: originalItem.cardName,
    cardImageUrl: originalItem.cardImageUrl,
    setName: originalItem.setName,
    setCode: originalItem.setCode,
    tcgType: originalItem.tcgType,
    sellPrice: originalItem.sellPrice,
  }),
});

export const mapFormItemsToNewPurchasePayload = (items: IPurchaseItem[]) =>
  items.map(item => ({
    cardGuid: item.cardGuid,
    cardName: item.cardName,
    cardImageUrl: item.cardImageUrl,
    setName: item.setName,
    setCode: item.setCode,
    condition: item.condition,
    quantity: item.quantity,
    offerPrice: item.offerPrice,
    referencePrice: item.referencePrice,
    sellPrice: item.sellPrice,
  }));
