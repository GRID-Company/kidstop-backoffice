import { useMutation } from '@apollo/client/react';
import { InventoryType } from '../../domain/inventory-create.domain';
import {
  GetChapesDocument,
  GetGlassesDocument,
  GetProfileVariantsDocument,
} from '../../../../lib/api/generated/inventory.generated';
import {
  CreateProfileDocument,
  CreateChapeDocument,
  CreateGlassDocument,
} from '@/lib/api/generated/inventory.generated';

export default function useInventoryMutation(inventoryType: InventoryType) {
  const profileMutation = useMutation(CreateProfileDocument, {
    refetchQueries: [GetProfileVariantsDocument],
  });
  const chapeMutation = useMutation(CreateChapeDocument, {
    refetchQueries: [GetChapesDocument],
  });
  const glassMutation = useMutation(CreateGlassDocument, {
    refetchQueries: [GetGlassesDocument],
  });

  const mutationMap: Record<InventoryType, any> = {
    herraje: chapeMutation,
    perfil: profileMutation,
    vidrio: glassMutation,
    varios: null,
  };

  return mutationMap?.[inventoryType] || profileMutation;
}
