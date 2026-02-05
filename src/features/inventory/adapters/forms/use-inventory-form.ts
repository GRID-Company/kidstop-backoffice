import { InventoryType } from '../../domain/inventory-create.domain';
import { useChapeForm } from './use-chape-form';
import { useGlassForm } from './use-glass-form';
import { useProfileForm } from './use-profile-form';

export default function useInventoryForm(inventoryType: InventoryType) {
  const chapeForm = useChapeForm();
  const glassForm = useGlassForm();
  const profileForm = useProfileForm();

  const formMap: Record<InventoryType, any> = {
    herraje: chapeForm,
    perfil: profileForm,
    vidrio: glassForm,
    varios: null,
  };

  const correctForm = formMap?.[inventoryType];

  return correctForm || profileForm;
}
