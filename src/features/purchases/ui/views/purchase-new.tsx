'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { ISeller } from '../../domain/types';
import { useNewPurchase } from '../hooks/use-new-purchase';
import { useSellers } from '../hooks/use-sellers';
import CardSearchWithMetrics from '../components/card-search-with-metrics';
import PurchaseItemsTable from '../components/purchase-items-table';
import BudgetIndicator from '../components/budget-indicator';
import PrivacyModeToggle from '../components/privacy-mode-toggle';
import SellerSelector from '../components/seller-selector';

interface PurchaseFormData {
  sellerGuid: string;
}

export default function PurchaseNew() {
  const router = useRouter();
  const {
    seller,
    items,
    currentBuyerSpent,
    existingItemIds,
    setSeller,
    addItem,
    updateItem,
    removeItem,
    canSave,
    savePurchase,
    saving,
  } = useNewPurchase();

  const { getSellerById } = useSellers();
  const { control, watch } = useForm<PurchaseFormData>({
    defaultValues: { sellerGuid: '' },
  });

  const selectedSellerGuid = watch('sellerGuid');
  const [isSellerConfirmed, setIsSellerConfirmed] = useState(false);

  const handleConfirmSeller = useCallback(() => {
    if (!selectedSellerGuid) return;
    const selectedSeller = getSellerById(selectedSellerGuid);
    if (selectedSeller) {
      setSeller(selectedSeller);
      setIsSellerConfirmed(true);
    }
  }, [selectedSellerGuid, getSellerById, setSeller]);

  const handleSellerCreated = useCallback((newSeller: ISeller) => {
    setSeller(newSeller);
    setIsSellerConfirmed(true);
  }, [setSeller]);

  const handleEditSeller = useCallback(() => {
    setIsSellerConfirmed(false);
  }, []);

  const handleSave = useCallback(() => {
    savePurchase();
    router.push('/compras');
  }, [savePurchase, router]);

  const isSellerFormValid = !!selectedSellerGuid;

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              isIconOnly
              variant="light"
              onPress={() => router.push('/compras')}
              aria-label="Volver a compras"
            >
              <Icon icon="lucide:arrow-left" width={20} />
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-accent">
                Nueva compra
              </span>
              <Chip size="sm" variant="flat" color="primary">
                Borrador
              </Chip>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PrivacyModeToggle />
          </div>
        </div>
      </EntitiesPage.Toolbar>

      <div className="flex flex-col gap-6 px-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardBody className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:user" width={18} className="text-accent" />
                    <span className="text-sm font-semibold">Vendedor</span>
                  </div>
                  {isSellerConfirmed && (
                    <Button
                      size="sm"
                      variant="light"
                      className="text-accent"
                      startContent={<Icon icon="lucide:pencil" width={14} />}
                      onPress={handleEditSeller}
                    >
                      Editar
                    </Button>
                  )}
                </div>

                {isSellerConfirmed && seller ? (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-default-400">Nombre</span>
                      <span className="font-medium">{seller.name}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-default-400">Teléfono</span>
                      <span className="font-medium">{seller.phone}</span>
                    </div>
                    {seller.email && (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-default-400">Email</span>
                        <span className="font-medium">{seller.email}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <SellerSelector
                      controlProps={{ control, name: 'sellerGuid' }}
                      onSellerCreated={handleSellerCreated}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        className="bg-accent text-white"
                        isDisabled={!isSellerFormValid}
                        onPress={handleConfirmSeller}
                        startContent={<Icon icon="lucide:check" width={16} />}
                      >
                        Confirmar vendedor
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
          <div>
            <BudgetIndicator
              items={items}
              currentSpent={currentBuyerSpent}
            />
          </div>
        </div>

        {isSellerConfirmed && (
          <EntitiesPage.CardContainer>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-accent">
                Agregar cartas
              </span>
              <CardSearchWithMetrics
                onAddItem={addItem}
                existingItemIds={existingItemIds}
              />
            </div>
          </EntitiesPage.CardContainer>
        )}

        <EntitiesPage.CardContainer>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:list" width={18} className="text-accent" />
                <span className="text-sm font-semibold">
                  Items de la compra
                </span>
                <Chip size="sm" variant="flat">
                  {items.length} {items.length === 1 ? 'carta' : 'cartas'}
                </Chip>
              </div>
            </div>
            <PurchaseItemsTable
              items={items}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
              isReadOnly={false}
            />
          </div>
        </EntitiesPage.CardContainer>

        <Divider />

        <div className="flex justify-end gap-3 pb-6">
          <Button
            variant="bordered"
            onPress={() => router.push('/compras')}
          >
            Cancelar
          </Button>
          <Button
            className="bg-accent text-white"
            isDisabled={!canSave}
            isLoading={saving}
            onPress={handleSave}
            startContent={!saving && <Icon icon="lucide:save" width={18} />}
          >
            {saving ? 'Guardando...' : 'Guardar compra'}
          </Button>
        </div>
      </div>
    </EntitiesPage>
  );
}
