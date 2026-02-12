'use client';

import DeckBuilder from '@/features/catalog/ui/views/deck-builder';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`Buscador Avanzado ${TITLE_SUFFIX}`);

  return <DeckBuilder />;
}
