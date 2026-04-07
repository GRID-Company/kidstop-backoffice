import { useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { InventoryItemsDocument } from '@/lib/api/generated/inventory.generated';
import {
  UpdateInventoryItemPricesDocument,
  PokemonCardInternalDetailDocument,
} from '@/lib/api/generated/catalog-pokemon.generated';

interface UpdatePriceParams {
  pokemonCardGuid: string;
  condition: string;
  purchasePrice: number;
  sellPrice: number;
}

export function useUpdateInventoryPrice() {
  const [fetchInventoryItems] = useLazyQuery(InventoryItemsDocument, {
    fetchPolicy: 'network-only',
  });

  const [updatePrice, { loading }] = useMutation(UpdateInventoryItemPricesDocument, {
    refetchQueries: [PokemonCardInternalDetailDocument],
  });

  const handleUpdatePrice = useCallback(
    async (params: UpdatePriceParams) => {
      const { data } = await fetchInventoryItems({
        variables: {
          findInventoryItemsArgs: {
            skip: 0,
            limit: 200,
            sort: { column: 'createdDate', order: 'DESC' },
            filters: { tcg: 'POKEMON', condition: params.condition },
          },
        },
      });

      const inventoryItems = data?.inventoryItems?.data ?? [];
      const match = inventoryItems.find(
        (item) => item?.pokemonCardSummary?.guid === params.pokemonCardGuid
      );

      if (!match) {
        toast.error('No se encontró el item en inventario');
        return;
      }

      await updatePrice({
        variables: {
          updateInventoryItemPricesInput: {
            inventoryItemGuid: match.guid,
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
