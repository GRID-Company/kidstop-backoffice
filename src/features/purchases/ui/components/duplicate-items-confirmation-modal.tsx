import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ScrollShadow,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { IPurchaseItem } from '../../domain/types';
import { PurchaseItemSummaryCard } from './purchase-item-summary-card';

interface DuplicateItemsConfirmationModalProps {
  isOpen: boolean;
  uniqueItems: IPurchaseItem[];
  duplicateItems: IPurchaseItem[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function DuplicateItemsConfirmationModal({
  isOpen,
  uniqueItems,
  duplicateItems,
  onConfirm,
  onCancel,
}: DuplicateItemsConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: 'max-h-[90vh]',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2 border-b border-default-200 pb-3">
          <Icon icon="lucide:alert-triangle" width={24} className="text-warning" />
          <span>Algunas cartas ya están agregadas</span>
        </ModalHeader>

        <ModalBody className="py-4">
          <div className="flex flex-col gap-6">
            {uniqueItems.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:check-circle"
                    width={20}
                    className="text-success"
                  />
                  <h3 className="text-sm font-semibold">
                    Se agregarán ({uniqueItems.length}{' '}
                    {uniqueItems.length === 1 ? 'carta' : 'cartas'}):
                  </h3>
                </div>

                <ScrollShadow className="max-h-50">
                  <div className="flex flex-col gap-2 pr-2">
                    {uniqueItems.map((item, index) => (
                      <PurchaseItemSummaryCard
                        key={`unique-${item.guid || index}`}
                        item={item}
                        variant="unique"
                      />
                    ))}
                  </div>
                </ScrollShadow>
              </div>
            )}

            {duplicateItems.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="lucide:alert-circle"
                    width={20}
                    className="text-warning"
                  />
                  <h3 className="text-sm font-semibold">
                    Se omitirán ({duplicateItems.length}{' '}
                    {duplicateItems.length === 1
                      ? 'carta duplicada'
                      : 'cartas duplicadas'}
                    ):
                  </h3>
                </div>

                <ScrollShadow className="max-h-50">
                  <div className="flex flex-col gap-2 pr-2">
                    {duplicateItems.map((item, index) => (
                      <PurchaseItemSummaryCard
                        key={`duplicate-${item.guid || index}`}
                        item={item}
                        variant="duplicate"
                      />
                    ))}
                  </div>
                </ScrollShadow>
              </div>
            )}
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-default-200 pt-3">
          <Button variant="flat" onPress={onCancel}>
            Cancelar
          </Button>
          <Button
            className="bg-accent text-white"
            onPress={onConfirm}
            startContent={<Icon icon="lucide:plus" width={16} />}
          >
            Agregar {uniqueItems.length}{' '}
            {uniqueItems.length === 1 ? 'carta' : 'cartas'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
