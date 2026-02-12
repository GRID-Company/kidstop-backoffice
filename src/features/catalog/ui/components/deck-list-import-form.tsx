'use client';

import { Button, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import TcgSegmentedSelector from '@/shared/base/tcg-segmented-selector';

const PLACEHOLDER_TEXT = `Pokémon:
4 Dreepy TWM 128
3 Dragapult ex TWM 130

Magic (Moxfield):
1 Lightning Bolt (4ED) 208
3 Counterspell (MH2) 267`;

interface DeckListImportFormProps {
  rawText: string;
  onTextChange: (value: string) => void;
  onImport: () => void;
  onClear: () => void;
  hasImported: boolean;
}

export default function DeckListImportForm({
  rawText,
  onTextChange,
  onImport,
  onClear,
  hasImported,
}: DeckListImportFormProps) {
  const canImport = rawText.trim().length > 0 && !hasImported;

  return (
    <div className="flex flex-col gap-4">
      <TcgSegmentedSelector />

      <Textarea
        label="Lista de cartas"
        placeholder={PLACEHOLDER_TEXT}
        value={rawText}
        onValueChange={onTextChange}
        minRows={6}
        maxRows={16}
        description="Pokémon (Limitless): [cant] [nombre] [set] [núm] — Magic (Moxfield): [cant] [nombre] ([set]) [núm]"
        aria-label="Lista de cartas en formato Limitless TCG o Moxfield"
      />

      <div className="flex gap-2">
        <Button
          color="primary"
          startContent={<Icon icon="lucide:upload" />}
          onPress={onImport}
          isDisabled={!canImport}
        >
          Importar lista
        </Button>
        {rawText.trim().length > 0 && (
          <Button
            variant="flat"
            startContent={<Icon icon="lucide:trash-2" />}
            onPress={onClear}
          >
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
