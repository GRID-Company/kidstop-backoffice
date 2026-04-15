import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { CreateInventoryMovementDocument } from '@/lib/api/generated/inventory.generated';
import { PokemonCardInternalDetailDocument } from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardInternalDetailDocument } from '@/lib/api/generated/catalog-magic.generated';
import { TCGType } from '@/lib/types/tcg.types';

interface AdjustStockParams {
  cardGuid: string;
  condition: string;
  quantity: number;
  notes?: string;
  tcgType: TCGType;
}

export function useAdjustInventoryStock() {
  const [createMovement, { loading }] = useMutation(CreateInventoryMovementDocument, {
    refetchQueries: [PokemonCardInternalDetailDocument, MagicCardInternalDetailDocument],
  });

  const handleAdjustStock = useCallback(
    async (params: AdjustStockParams) => {
      const isPositive = params.quantity > 0;

      await createMovement({
        variables: {
          createInventoryMovementInput: {
            cardGuid: params.cardGuid,
            condition: params.condition,
            tcg: params.tcgType,
            movementType: 'MANUAL_ADJUSTMENT',
            quantity: isPositive ? params.quantity : -Math.abs(params.quantity),
            notes: params.notes || `Ajuste de stock: ${params.quantity > 0 ? '+' : ''}${params.quantity}`,
          },
        },
      });

      toast.success(`Stock ajustado: ${params.quantity > 0 ? '+' : ''}${params.quantity}`);
    },
    [createMovement]
  );

  return { handleAdjustStock, loading };
}
