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
      let bulkOperationType: BulkOperationType;
      let finalQuantity: number;
      let successMessage: string;

      switch (params.operationType) {
        case BulkOperationType.ManualEntry:
          bulkOperationType = BulkOperationType.ManualEntry;
          finalQuantity = Math.abs(params.quantity);
          successMessage = `Entrada registrada: +${params.quantity}`;
          break;
        case BulkOperationType.ManualExit:
          bulkOperationType = BulkOperationType.ManualExit;
          finalQuantity = Math.abs(params.quantity);
          successMessage = `Salida registrada: -${params.quantity}`;
          break;
        case BulkOperationType.ManualSet:
          bulkOperationType = BulkOperationType.ManualSet;
          finalQuantity = params.quantity;
          successMessage = `Stock establecido a: ${params.quantity}`;
          break;
        default:
          bulkOperationType = BulkOperationType.ManualEntry;
          finalQuantity = params.quantity;
          successMessage = `Stock ajustado: ${params.quantity}`;
      }

      await createMovement({
        variables: {
          createInventoryMovementInput: {
            cardGuid: params.cardGuid,
            condition: params.condition,
            tcg: params.tcgType,
            bulkOperationType,
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
