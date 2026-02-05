'use client';
import UploadInventoryButton from '@/features/inventory/ui/components/upload-inventory-button';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import AddNewButton from '@/shared/base/buttons/add-new-button';
import { EntitiesPage } from '@/shared/blocks/entities-page';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Cotizaciones ${TITLE_SUFFIX}`);

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label='Cotizaciones'>
        <EntitiesPage.FlexRow>
          <AddNewButton label='Nueva cotización' />
        </EntitiesPage.FlexRow>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer> </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
