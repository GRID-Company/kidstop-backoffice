'use client';

import { useCallback, useState } from 'react';
import { DrawerBody, DrawerContent, DrawerHeader } from '@heroui/react';
import KidstopDrawer from '@/shared/base/heorui-overrides/drawer';
import PokemonCardDetailModal from '@/features/catalog/ui/components/pokemon-card-detail-modal';
import MagicCardDetailModal from '@/features/catalog/ui/components/magic-card-detail-modal';
import { useCardScannerStore } from '@/lib/store/card-scanner';
import { ScannerPanel } from './scanner-panel';
import type { ICardCandidate } from '../../domain/types';
import {
  mapScanCandidateToMagicCard,
  mapScanCandidateToPokemonCard,
} from '../../adapters/mappers/scan-candidate-to-catalog-card.mapper';

export const CardScannerDrawer = () => {
  const isOpen = useCardScannerStore((state) => state.isOpen);
  const source = useCardScannerStore((state) => state.source);
  const closeScanner = useCardScannerStore((state) => state.closeScanner);
  const [detailCandidate, setDetailCandidate] = useState<ICardCandidate | null>(
    null
  );

  const handleOpenCardDetail = useCallback(
    (candidate: ICardCandidate) => {
      setDetailCandidate(candidate);
      closeScanner();
    },
    [closeScanner]
  );

  const handleCloseCardDetail = useCallback(() => {
    setDetailCandidate(null);
  }, []);

  return (
    <>
      <KidstopDrawer
        isOpen={isOpen}
        onClose={closeScanner}
        size='xl'
        placement='right'
      >
        <DrawerContent>
          <DrawerHeader className='flex flex-col gap-1'>
            <span className='text-accent text-lg font-semibold'>
              Escáner de cartas
            </span>
            <span className='text-default-500 text-sm font-normal'>
              Posiciona la carta dentro del marco para identificarla
            </span>
          </DrawerHeader>
          <DrawerBody>
            {isOpen && (
              <ScannerPanel
                source={source}
                onOpenCardDetail={handleOpenCardDetail}
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </KidstopDrawer>

      {detailCandidate?.game === 'pokemon' && (
        <PokemonCardDetailModal
          card={mapScanCandidateToPokemonCard(detailCandidate)}
          isOpen
          onClose={handleCloseCardDetail}
        />
      )}
      {detailCandidate?.game === 'magic' && (
        <MagicCardDetailModal
          card={mapScanCandidateToMagicCard(detailCandidate)}
          isOpen
          onClose={handleCloseCardDetail}
        />
      )}
    </>
  );
};
