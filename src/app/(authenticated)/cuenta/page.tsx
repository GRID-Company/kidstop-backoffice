'use client';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import AddNewButton from '@/shared/base/buttons/add-new-button';
import { EntitiesPage } from '@/shared/blocks/entities-page';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Cuenta ${TITLE_SUFFIX}`);

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label='Ventanas'>
        <EntitiesPage.FlexRow>
          <AddNewButton label='Nueva ventana' />
        </EntitiesPage.FlexRow>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer> </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
