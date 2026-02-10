'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
} from '@heroui/react';
import { Icon } from '@iconify/react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { ISeller } from '../../domain/types';
import { useNewPurchase } from '../hooks/use-new-purchase';
import CardSearchWithMetrics from '../components/card-search-with-metrics';
import PurchaseItemsTable from '../components/purchase-items-table';
import BudgetIndicator from '../components/budget-indicator';
import PrivacyModeToggle from '../components/privacy-mode-toggle';

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
  } = useNewPurchase();

  const [sellerForm, setSellerForm] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [isSellerConfirmed, setIsSellerConfirmed] = useState(false);

  const handleConfirmSeller = useCallback(() => {
    if (!sellerForm.name.trim() || !sellerForm.phone.trim()) return;
    const newSeller: ISeller = {
      id: `seller-${Date.now()}`,
      name: sellerForm.name.trim(),
      phone: sellerForm.phone.trim(),
      email: sellerForm.email.trim() || undefined,
    };
    setSeller(newSeller);
    setIsSellerConfirmed(true);
  }, [sellerForm, setSeller]);

  const handleEditSeller = useCallback(() => {
    setIsSellerConfirmed(false);
  }, []);

  const handleSave = useCallback(() => {
    savePurchase();
    router.push('/compras');
  }, [savePurchase, router]);

  const isSellerFormValid =
    sellerForm.name.trim().length > 0 && sellerForm.phone.trim().length > 0;

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
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Input
                        aria-label="Nombre del vendedor"
                        label="Nombre"
                        placeholder="Nombre del vendedor"
                        size="sm"
                        variant="bordered"
                        isRequired
                        value={sellerForm.name}
                        onValueChange={(val) =>
                          setSellerForm((s) => ({ ...s, name: val }))
                        }
                        classNames={{
                          inputWrapper: 'border-[1px] bg-white',
                          label: 'text-xs',
                        }}
                      />
                      <Input
                        aria-label="Teléfono del vendedor"
                        label="Teléfono"
                        placeholder="+52 55 1234 5678"
                        size="sm"
                        variant="bordered"
                        isRequired
                        value={sellerForm.phone}
                        onValueChange={(val) =>
                          setSellerForm((s) => ({ ...s, phone: val }))
                        }
                        classNames={{
                          inputWrapper: 'border-[1px] bg-white',
                          label: 'text-xs',
                        }}
                      />
                    </div>
                    <Input
                      aria-label="Email del vendedor"
                      label="Email"
                      placeholder="email@ejemplo.com"
                      type="email"
                      size="sm"
                      variant="bordered"
                      value={sellerForm.email}
                      onValueChange={(val) =>
                        setSellerForm((s) => ({ ...s, email: val }))
                      }
                      classNames={{
                        inputWrapper: 'border-[1px] bg-white',
                        label: 'text-xs',
                      }}
                      className="sm:w-1/2"
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
            onPress={handleSave}
            startContent={<Icon icon="lucide:save" width={18} />}
          >
            Guardar compra
          </Button>
        </div>
      </div>
    </EntitiesPage>
  );
}
