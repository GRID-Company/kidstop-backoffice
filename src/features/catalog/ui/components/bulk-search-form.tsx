'use client';

import { Button, Textarea, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';
import { useBulkLookupStore } from '../../adapters/store/bulk-lookup.store';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';

const PLACEHOLDER_TEXT = `Pokémon:
4 Dreepy TWM 128
3 Dragapult ex TWM 130

Magic (Moxfield):
1 Lightning Bolt (4ED) 208
3 Counterspell (MH2) 267`;

interface BulkSearchFormProps {
  onSearch: () => void;
  isLoading?: boolean;
}

export default function BulkSearchForm({ onSearch, isLoading = false }: BulkSearchFormProps) {
  const { rawText, setRawText } = useBulkLookupStore();
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);

  const canSearch = rawText.trim().length > 0 && selectedTCG;

  const handleClear = () => {
    setRawText('');
  };

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Selecciona el tipo de TCG</h3>
          <TcgSegmentedSelector />
        </div>

        <Textarea
          label="Lista de cartas"
          placeholder={PLACEHOLDER_TEXT}
          value={rawText}
          onValueChange={setRawText}
          minRows={6}
          maxRows={16}
          description="Pokémon (Limitless): [cant] [nombre] [set] [núm] — Magic (Moxfield): [cant] [nombre] ([set]) [núm]"
          aria-label="Lista de cartas en formato Limitless TCG o Moxfield"
        />

        <div className="flex gap-2">
          <Button
            color="primary"
            startContent={<Icon icon="lucide:search" />}
            onPress={onSearch}
            isDisabled={!canSearch}
            isLoading={isLoading}
          >
            Buscar cartas
          </Button>
          {rawText.trim().length > 0 && (
            <Button
              variant="flat"
              startContent={<Icon icon="lucide:trash-2" />}
              onPress={handleClear}
              isDisabled={isLoading}
            >
              Limpiar
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
