'use client';

import { EntitiesPage } from '@/shared/blocks/entities-page';

export default function DeckBuilder() {
  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label='Buscador Avanzado'>
        <></>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <div className='flex flex-col items-center justify-center gap-3 py-24 text-center'>
          <p className='text-foreground text-lg font-semibold'>
            Módulo en construcción
          </p>
          <p className='text-default-500 text-sm'>
            El Buscador Avanzado está siendo trabajado. Estará disponible
            próximamente.
          </p>
        </div>
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
