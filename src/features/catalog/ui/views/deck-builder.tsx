'use client';

import { useState } from 'react';
import { Tabs, Tab } from '@heroui/react';
import { EntitiesPage } from '@/shared/blocks/entities-page';
import BulkLookupComplete from './bulk-lookup-complete';
import BulkLookupModular from './bulk-lookup-modular';

type ViewMode = 'complete' | 'modular';

export default function DeckBuilder() {
  const [viewMode, setViewMode] = useState<ViewMode>('complete');

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="Buscador Avanzado">
        <></>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <div className="w-full">
          <Tabs
            selectedKey={viewMode}
            onSelectionChange={(key) => setViewMode(key as ViewMode)}
            aria-label="Modo de búsqueda"
            color="primary"
            variant="underlined"
            className="mb-6"
          >
            <Tab key="complete" title="Flujo Completo">
              <BulkLookupComplete />
            </Tab>
            <Tab key="modular" title="Flujo Modular">
              <BulkLookupModular />
            </Tab>
          </Tabs>
        </div>
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
