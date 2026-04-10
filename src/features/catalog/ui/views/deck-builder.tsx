'use client';

import { EntitiesPage } from '@/shared/blocks/entities-page';

export default function DeckBuilder() {
  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="Buscador Avanzado">
        <></>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <p className="text-lg font-semibold text-foreground">Módulo en construcción</p>
          <p className="text-sm text-default-500">
            El Buscador Avanzado está siendo trabajado. Estará disponible próximamente.
          </p>
        </div>
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
