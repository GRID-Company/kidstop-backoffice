'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Chip,
  Divider,
  ScrollShadow,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import Search from '@/shared/base/heorui-overrides/search';
import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { IPokemonCard, IMagicCard } from '@/features/catalog/domain/types';
import { MostWantedCardFormData } from '../../adapters/forms/most-wanted-card.schema';
import CardPrioritySelector from './card-priority-selector';
import { useAddCardModal } from '../hooks/use-add-card-modal';

type CardType = IPokemonCard | IMagicCard;

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (data: MostWantedCardFormData) => void | Promise<void>;
  search: string;
  onSearchChange: (value: string) => void;
  searchResults: CardType[];
  selectedCard: CardType | null;
  onSelectCard: (card: CardType | null) => void;
  form: ReturnType<typeof useAddCardModal>['form'];
  onSubmit: ReturnType<typeof useAddCardModal>['handleSubmit'];
  loading?: boolean;
}

function CardSearchResult({
  card,
  isSelected,
  onPress,
}: {
  card: CardType;
  isSelected: boolean;
  onPress: () => void;
}) {
  const isPokemon = 'setCode' in card;
  const cardSet = isPokemon ? (card as IPokemonCard).setName : (card as IMagicCard).edition;
  const cardCode = isPokemon ? (card as IPokemonCard).setCode : (card as IMagicCard).collectorNumber;
  return (
    <Button
      variant={isSelected ? 'flat' : 'light'}
      className={`h-auto w-full justify-start gap-3 px-3 py-2 ${
        isSelected ? 'bg-accent/10 border-accent border' : ''
      }`}
      onPress={onPress}
    >
      <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded bg-default-100">
        {card.imageUri ? (
          <img
            src={card.imageUri}
            alt={card.name}
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-default-400">
            <Icon icon="lucide:image" width={16} />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span className="truncate text-sm font-semibold">{card.name}</span>
        <span className="truncate text-xs text-default-500">
          {cardSet} · {cardCode}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-default-500">Stock: {card.totalStock}</span>
        </div>
      </div>
    </Button>
  );
}

function SelectedCardPreview({ card }: { card: CardType }) {
  const isPokemon = 'setCode' in card;
  const cardSet = isPokemon ? (card as IPokemonCard).setName : (card as IMagicCard).edition;
  const cardCode = isPokemon ? (card as IPokemonCard).setCode : (card as IMagicCard).collectorNumber;
  return (
    <div className="flex gap-4 rounded-lg bg-default-50 p-4">
      <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg bg-default-100">
        {card.imageUri ? (
          <img
            src={card.imageUri}
            alt={card.name}
            className="absolute inset-0 h-full w-full object-contain p-1"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-default-400">
            <Icon icon="lucide:image" width={24} />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold text-accent">{card.name}</p>
        <p className="text-xs text-default-500">
          {cardSet} · {cardCode}
        </p>

        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            variant="flat"
            classNames={{
              base: 'bg-accent/10',
              content: 'text-accent font-medium',
            }}
          >
            {isPokemon ? 'POKEMON' : 'MAGIC'}
          </Chip>
        </div>

        <span className="text-xs text-default-500">
          Stock total: {card.totalStock}
        </span>
      </div>
    </div>
  );
}

export default function AddCardModal({
  isOpen,
  onClose,
  onAdd,
  search,
  onSearchChange,
  searchResults,
  selectedCard,
  onSelectCard,
  form,
  onSubmit,
}: AddCardModalProps) {
  const { control, formState } = form;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="xl">
      <DrawerContent>
        <DrawerHeader className="flex flex-col gap-1">
          <span className="text-lg font-semibold text-accent">
            Agregar carta a Most Wanted
          </span>
          <span className="text-sm font-normal text-default-500">
            Busca una carta del catálogo y defínele prioridad
          </span>
        </DrawerHeader>

        <DrawerBody className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Search
              label="Buscar carta"
              placeholder="Nombre, set o identificador"
              value={search}
              onValueChange={onSearchChange}
              aria-label="Buscar carta del catálogo"
            />

            {search.trim() && (
              <p className="text-xs text-default-400">
                {searchResults.length}{' '}
                {searchResults.length === 1
                  ? 'carta disponible'
                  : 'cartas disponibles'}
              </p>
            )}

            {searchResults.length > 0 && !selectedCard && (
              <ScrollShadow className="max-h-60">
                <div className="flex flex-col gap-1">
                  {searchResults.map((card) => (
                    <CardSearchResult
                      key={card.guid}
                      card={card}
                      isSelected={false}
                      onPress={() => onSelectCard(card)}
                    />
                  ))}
                </div>
              </ScrollShadow>
            )}

            {search.trim() && searchResults.length === 0 && !selectedCard && (
              <div className="flex flex-col items-center gap-2 py-6 text-default-400">
                <Icon icon="lucide:search-x" width={32} />
                <p className="text-sm">No se encontraron cartas disponibles</p>
              </div>
            )}
          </div>

          {selectedCard && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Carta seleccionada</span>
                <Button
                  size="sm"
                  variant="light"
                  startContent={<Icon icon="lucide:x" width={14} />}
                  onPress={() => {
                    onSelectCard(null);
                    onSearchChange('');
                  }}
                  className="text-default-500"
                >
                  Cambiar
                </Button>
              </div>

              <SelectedCardPreview card={selectedCard} />

              <Divider />

              <form
                onSubmit={(...args) => {
                  void onSubmit(onAdd)(...args);
                }}
                className="flex flex-col gap-5"
              >
                <CardPrioritySelector<MostWantedCardFormData>
                  controlProps={{ control, name: 'priority' }}
                  label="Prioridad"
                />

                <TextareaForm<MostWantedCardFormData>
                  controlProps={{ control, name: 'notes' }}
                  label="Notas (opcional)"
                  placeholder="Ej: Clientes preguntan seguido por esta carta"
                  maxRows={3}
                />

                <Button
                  type="submit"
                  isDisabled={!formState.isValid}
                  startContent={<Icon icon="lucide:plus" />}
                  className="text-white"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  Agregar a Most Wanted
                </Button>
              </form>
            </>
          )}

          {!selectedCard && !search.trim() && (
            <div className="flex flex-col items-center gap-3 py-10 text-default-400">
              <Icon icon="lucide:search" width={40} />
              <p className="text-sm">
                Busca una carta para agregarla a Most Wanted
              </p>
            </div>
          )}
        </DrawerBody>

        <DrawerFooter className="flex justify-end">
          <Button variant="light" onPress={onClose} className="text-accent">
            Cancelar
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
