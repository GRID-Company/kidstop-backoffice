import { useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { InventoryItemsDocument } from '@/lib/api/generated/inventory.generated';
import {
  UpdateInventoryItemPricesDocument,
  PokemonCardInternalDetailDocument,
} from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardInternalDetailDocument } from '@/lib/api/generated/catalog-magic.generated';
import { TCGType } from '@/lib/types/tcg.types';

interface UpdatePriceParams {
  cardGuid: string;
  inventoryItemGuid?: string;
  condition: string;
  purchasePrice: number;
  sellPrice: number;
  tcgType: TCGType;
}

export function useUpdateInventoryPrice() {
  const [fetchInventoryItems] = useLazyQuery(InventoryItemsDocument, {
    fetchPolicy: 'network-only',
  });

  const [updatePrice, { loading }] = useMutation(UpdateInventoryItemPricesDocument, {
    refetchQueries: [PokemonCardInternalDetailDocument, MagicCardInternalDetailDocument],
  });

  const handleUpdatePrice = useCallback(
    async (params: UpdatePriceParams) => {
      let inventoryItemGuid = params.inventoryItemGuid;

      if (!inventoryItemGuid) {
        const { data } = await fetchInventoryItems({
          variables: {
            findInventoryItemsArgs: {
              skip: 0,
              limit: 200,
              sort: { column: 'createdDate', order: 'DESC' },
              filters: { tcg: params.tcgType, condition: params.condition },
            },
          },
        });

        const inventoryItems = data?.inventoryItems?.data ?? [];
        const match = inventoryItems.find((item) => {
          if (params.tcgType === 'POKEMON') {
            return item?.pokemonCardSummary?.guid === params.cardGuid;
          } else {
            return item?.magicCardSummary?.guid === params.cardGuid;
          }
        });

        if (!match) {
          toast.error('No se encontró el item en inventario');
          return;
        }

        inventoryItemGuid = match.guid;
      }

      await updatePrice({
        variables: {
          updateInventoryItemPricesInput: {
            inventoryItemGuid,
            purchasePrice: params.purchasePrice,
            sellPrice: params.sellPrice,
          },
        },
      });

      toast.success('Precios actualizados correctamente');
    },
    [fetchInventoryItems, updatePrice]
  );

  return { handleUpdatePrice, loading };
}
