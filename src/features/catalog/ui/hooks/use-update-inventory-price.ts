import { useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { InventoryItemsDocument, CreateInventoryMovementDocument } from '@/lib/api/generated/inventory.generated';
import {
  UpdateInventoryItemPricesDocument,
  PokemonCardInternalDetailDocument,
} from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardInternalDetailDocument } from '@/lib/api/generated/catalog-magic.generated';
import { TCGType } from '@/lib/types/tcg.types';
import { BulkOperationType } from '@/lib/api/schema-types';

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

  const [createMovement] = useMutation(CreateInventoryMovementDocument, {
    refetchQueries: [InventoryItemsDocument],
  });

  const [updatePrice, { loading }] = useMutation(UpdateInventoryItemPricesDocument, {
    refetchQueries: [PokemonCardInternalDetailDocument, MagicCardInternalDetailDocument],
  });

  const handleUpdatePrice = useCallback(
    async (params: UpdatePriceParams) => {
      let inventoryItemGuid = params.inventoryItemGuid;

      if (!inventoryItemGuid) {
        try {
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
            try {
              await createMovement({
                variables: {
                  createInventoryMovementInput: {
                    cardGuid: params.cardGuid,
                    condition: params.condition,
                    tcg: params.tcgType,
                    bulkOperationType: BulkOperationType.ManualSet,
                    quantity: 0,
                    notes: 'Creación automática para establecer precios',
                  },
                },
              });
            } catch (error) {
              toast.error('Error al crear el item en inventario. Por favor intenta de nuevo.');
              throw error;
            }

            const { data: newData } = await fetchInventoryItems({
              variables: {
                findInventoryItemsArgs: {
                  skip: 0,
                  limit: 200,
                  sort: { column: 'createdDate', order: 'DESC' },
                  filters: { tcg: params.tcgType, condition: params.condition },
                },
              },
            });

            const newInventoryItems = newData?.inventoryItems?.data ?? [];
            const newMatch = newInventoryItems.find((item) => {
              if (params.tcgType === 'POKEMON') {
                return item?.pokemonCardSummary?.guid === params.cardGuid;
              } else {
                return item?.magicCardSummary?.guid === params.cardGuid;
              }
            });

            if (!newMatch) {
              toast.error('No se pudo crear el item en inventario. Por favor intenta de nuevo.');
              throw new Error('Inventory item creation failed');
            }

            inventoryItemGuid = newMatch.guid;
          } else {
            inventoryItemGuid = match.guid;
          }
        } catch (error) {
          if (error instanceof Error && error.message === 'Inventory item creation failed') {
            return;
          }
          toast.error('Error al buscar items en inventario');
          throw error;
        }
      }

      try {
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
      } catch (error) {
        toast.error('Error al actualizar precios. Por favor intenta de nuevo.');
        throw error;
      }
    },
    [fetchInventoryItems, createMovement, updatePrice]
  );

  return { handleUpdatePrice, loading };
}
