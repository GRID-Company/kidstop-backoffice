import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { CreateInventoryMovementDocument } from '@/lib/api/generated/inventory.generated';
import { PokemonCardInternalDetailDocument } from '@/lib/api/generated/catalog-pokemon.generated';
import { MagicCardInternalDetailDocument } from '@/lib/api/generated/catalog-magic.generated';
import { TCGType } from '@/lib/types/tcg.types';
import { BulkOperationType } from '@/lib/api/schema-types';

interface AdjustStockParams {
  cardGuid: string;
  condition: string;
  quantity: number;
  notes?: string;
  tcgType: TCGType;
  operationType: BulkOperationType;
}

export function useAdjustInventoryStock() {
  const [createMovement, { loading }] = useMutation(CreateInventoryMovementDocument, {
    refetchQueries: [PokemonCardInternalDetailDocument, MagicCardInternalDetailDocument],
  });

  const handleAdjustStock = useCallback(
    async (params: AdjustStockParams) => {
      let movementType: string;
      let finalQuantity: number;
      let successMessage: string;

      switch (params.operationType) {
        case BulkOperationType.ManualEntry:
          movementType = 'PURCHASE_ENTRY';
          finalQuantity = Math.abs(params.quantity);
          successMessage = `Entrada registrada: +${params.quantity}`;
          break;
        case BulkOperationType.ManualExit:
          movementType = 'SALE_EXIT';
          finalQuantity = Math.abs(params.quantity);
          successMessage = `Salida registrada: -${params.quantity}`;
          break;
        case BulkOperationType.ManualSet:
          movementType = 'MANUAL_ADJUSTMENT';
          finalQuantity = params.quantity;
          successMessage = `Stock establecido a: ${params.quantity}`;
          break;
        default:
          movementType = 'MANUAL_ADJUSTMENT';
          finalQuantity = params.quantity;
          successMessage = `Stock ajustado: ${params.quantity}`;
      }

      await createMovement({
        variables: {
          createInventoryMovementInput: {
            cardGuid: params.cardGuid,
            condition: params.condition,
            tcg: params.tcgType,
            movementType,
            quantity: finalQuantity,
            notes: params.notes || successMessage,
          },
        },
      });

      toast.success(successMessage);
    },
    [createMovement]
  );

  return { handleAdjustStock, loading };
}
