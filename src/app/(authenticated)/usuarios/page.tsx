'use client';
import UploadInventoryButton from '@/features/inventory/ui/components/upload-inventory-button';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import AddNewButton from '@/shared/base/buttons/add-new-button';
import { EntitiesPage } from '@/shared/blocks/entities-page';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Usuarios ${TITLE_SUFFIX}`);

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label='Usuarios'>
        <EntitiesPage.FlexRow>
          <AddNewButton label='Nuevo usuario' />
        </EntitiesPage.FlexRow>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer> </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
