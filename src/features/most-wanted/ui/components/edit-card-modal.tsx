'use client';

import { useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import TextareaForm from '@/shared/base/form-controls/textarea-form';
import { IMostWantedCard, MostWantedPriority } from '../../domain/types';
import { MostWantedCardFormData } from '../../adapters/forms/most-wanted-card.schema';
import { useMostWantedForm } from '../../adapters/forms/use-most-wanted-form';
import { toMostWantedFormDefaults } from '../../adapters/mappers/most-wanted.mapper';
import CardPrioritySelector from './card-priority-selector';

interface EditCardModalProps {
  item: IMostWantedCard | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (guid: string, updates: { priority: MostWantedPriority; notes: string }) => void | Promise<void>;
}

export default function EditCardModal({
  item,
  isOpen,
  onClose,
  onSave,
}: EditCardModalProps) {
  const form = useMostWantedForm(item ? toMostWantedFormDefaults(item) : undefined);
  const { control, formState, handleSubmit, reset } = form;

  useEffect(() => {
    if (item && isOpen) {
      reset(toMostWantedFormDefaults(item));
    }
  }, [item, isOpen, reset]);

  const onSubmit = handleSubmit(async (data: MostWantedCardFormData) => {
    if (!item) return;
    await onSave(item.guid, {
      priority: data.priority as MostWantedPriority,
      notes: data.notes,
    });
    onClose();
  });

  const cardName = item?.pokemonCardSummary?.name || item?.magicCardSummary?.name || '';
  const cardSet = item?.pokemonCardSummary?.setName || item?.magicCardSummary?.edition || '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void onSubmit(e);
          }}
        >
          <ModalHeader className="flex flex-col gap-1">
            <span className="text-accent">Editar carta</span>
            {item && (
              <span className="text-sm font-normal text-default-500">
                {cardName} · {cardSet}
              </span>
            )}
          </ModalHeader>

          <ModalBody className="flex flex-col gap-5">
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
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              isDisabled={!formState.isValid || !formState.isDirty}
              startContent={<Icon icon="lucide:check" />}
              className="text-white"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              Guardar cambios
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
