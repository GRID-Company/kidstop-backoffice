'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, Chip, Divider, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import BulkCardSearch from '@/shared/blocks/bulk-card-search';
import { BulkSearchFormDataPurchases } from '@/shared/blocks/bulk-card-search/schemas';
import { BulkCardResult } from '@/shared/blocks/bulk-card-search/types';
import { mapBulkSearchToPurchaseItems } from '../../adapters/mappers/bulk-search-to-purchase-items.mapper';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { ISeller } from '../../domain/types';
import { SellerFormData } from '../../adapters/forms/seller-form.schema';
import { useNewPurchase } from '../hooks/use-new-purchase';
import { useSellers } from '../hooks/use-sellers';
import { usePurchaseForm } from '../../adapters/forms/use-purchase-form';
import CardSearchWithMetrics from '../components/card-search-with-metrics';
import PurchaseItemsList from '../components/purchase-items-list';
import BudgetIndicator from '../components/budget-indicator';
import PrivacyModeToggle from '../components/privacy-mode-toggle';
import SellerSelector from '../components/seller-selector';
import SellerEditDrawer from '../components/seller-edit-drawer';
import SellerDeleteModal from '../components/seller-delete-modal';

export default function PurchaseNew() {
  const router = useRouter();
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);
  const {
    seller,
    items,
    currentBuyerSpent,
    assignedBudget,
    existingItemIds,
    form: purchaseForm,
    setSeller,
    addItem,
    updateItem,
    removeItem,
    canSave,
    savePurchase,
    saving,
  } = useNewPurchase();

  const { getSellerById, updateSeller, deleteSeller, updating, deleting } =
    useSellers();
  const { control, watch, setValue } = usePurchaseForm();

  const selectedSellerGuid = watch('sellerGuid');
  const [isSellerConfirmed, setIsSellerConfirmed] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAdvancedSearchEnabled, setIsAdvancedSearchEnabled] = useState(false);

  const handleBulkSearchConfirm = useCallback(
    (data: BulkSearchFormDataPurchases, results: BulkCardResult[]) => {
      try {
        const newItems = mapBulkSearchToPurchaseItems(data, results, selectedTCG);
        newItems.forEach((item) => addItem(item));
        toast.success(`${newItems.length} cartas agregadas exitosamente`);
        setIsAdvancedSearchEnabled(false);
      } catch (error) {
        toast.error('Error al agregar cartas desde búsqueda masiva');
      }
    },
    [addItem, selectedTCG]
  );

  const handleBulkSearchCancel = useCallback(() => {
    setIsAdvancedSearchEnabled(false);
  }, []);

  const handleConfirmSeller = useCallback(() => {
    if (!selectedSellerGuid) return;
    const selectedSeller = getSellerById(selectedSellerGuid);
    if (selectedSeller) {
      setSeller(selectedSeller);
      setIsSellerConfirmed(true);
    }
  }, [selectedSellerGuid, getSellerById, setSeller]);

  const handleSellerCreated = useCallback(
    (newSeller: ISeller) => {
      setSeller(newSeller);
      setIsSellerConfirmed(true);
    },
    [setSeller]
  );

  const handleEditSeller = useCallback(() => {
    setIsEditDrawerOpen(true);
  }, []);

  const handleUpdateSeller = useCallback(
    async (data: SellerFormData) => {
      if (!seller) return;
      const updatedSeller = await updateSeller(seller.guid, data);
      if (updatedSeller) {
        setSeller(updatedSeller);
        setIsEditDrawerOpen(false);
      }
    },
    [seller, updateSeller, setSeller]
  );

  const handleDeleteSeller = useCallback(async () => {
    if (!seller) return;
    const deleted = await deleteSeller(seller.guid);
    if (deleted) {
      setSeller(null);
      setIsSellerConfirmed(false);
      setIsDeleteModalOpen(false);
      setValue('sellerGuid', '');
    }
  }, [seller, deleteSeller, setSeller, setValue]);

  const handleDeselectSeller = useCallback(() => {
    setIsSellerConfirmed(false);
    setValue('sellerGuid', '');
  }, [setValue]);

  const handleSave = useCallback(async () => {
    const isValid = await purchaseForm.trigger();
    if (!isValid) {
      const errors = purchaseForm.formState.errors;
      if (errors.items?.message) {
        toast.error(errors.items.message);
      } else if (errors.items) {
        toast.error('Hay errores en los items. Verifica cantidad y precio.');
      }
      return;
    }
    savePurchase();
    router.push('/compras');
  }, [savePurchase, router, purchaseForm]);

  const isSellerFormValid = !!selectedSellerGuid;

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label=''>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Button
              isIconOnly
              variant='light'
              onPress={() => router.push('/compras')}
              aria-label='Volver a compras'
            >
              <Icon icon='lucide:arrow-left' width={20} />
            </Button>
            <div className='flex items-center gap-3'>
              <span className='text-accent text-lg font-semibold'>
                Nueva compra
              </span>
              <Chip size='sm' variant='flat' color='primary'>
                Borrador
              </Chip>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <PrivacyModeToggle />
          </div>
        </div>
      </EntitiesPage.Toolbar>

      <div className='flex flex-col gap-6 px-4'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div
            className={assignedBudget > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}
          >
            <Card>
              <CardBody className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Icon
                      icon='lucide:user'
                      width={18}
                      className='text-accent'
                    />
                    <span className='text-sm font-semibold'>Vendedor</span>
                  </div>
                  {isSellerConfirmed && (
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant='light'
                        className='text-accent'
                        startContent={<Icon icon='lucide:pencil' width={14} />}
                        onPress={handleEditSeller}
                        isDisabled={updating || deleting}
                      >
                        Editar
                      </Button>
                      <Button
                        size='sm'
                        variant='light'
                        className='text-danger'
                        startContent={<Icon icon='lucide:trash-2' width={14} />}
                        onPress={() => setIsDeleteModalOpen(true)}
                        isDisabled={updating || deleting}
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>

                {isSellerConfirmed && seller ? (
                  <div className='flex flex-col gap-4'>
                    <div className='grid grid-cols-2 gap-x-6 gap-y-2 text-sm'>
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-default-400'>Nombre</span>
                        <span className='font-medium'>{seller.name}</span>
                      </div>
                      <div className='flex flex-col gap-0.5'>
                        <span className='text-default-400'>Teléfono</span>
                        <span className='font-medium'>{seller.phone}</span>
                      </div>
                      {seller.email && (
                        <div className='flex flex-col gap-0.5'>
                          <span className='text-default-400'>Email</span>
                          <span className='font-medium'>{seller.email}</span>
                        </div>
                      )}
                    </div>
                    <div className='flex justify-end'>
                      <Button
                        size='sm'
                        variant='light'
                        className='text-accent'
                        onPress={handleDeselectSeller}
                        isDisabled={updating || deleting}
                      >
                        Seleccionar otro vendedor
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className='flex flex-col gap-3'>
                    <SellerSelector
                      controlProps={{ control, name: 'sellerGuid' }}
                      onSellerCreated={handleSellerCreated}
                    />
                    <div className='flex justify-end'>
                      <Button
                        size='sm'
                        className='bg-accent text-white'
                        isDisabled={!isSellerFormValid}
                        onPress={handleConfirmSeller}
                        startContent={<Icon icon='lucide:check' width={16} />}
                      >
                        Confirmar vendedor
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
          {assignedBudget > 0 && (
            <div>
              <BudgetIndicator
                items={items}
                currentSpent={currentBuyerSpent}
                budgetLimit={assignedBudget}
              />
            </div>
          )}
        </div>

        {isSellerConfirmed && (
          <EntitiesPage.CardContainer>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <span className='text-accent text-sm font-semibold'>
                  Agregar cartas
                </span>
                <Switch
                  size='sm'
                  isSelected={isAdvancedSearchEnabled}
                  onValueChange={setIsAdvancedSearchEnabled}
                >
                  <span className='text-xs'>Búsqueda avanzada</span>
                </Switch>
              </div>

              {isAdvancedSearchEnabled ? (
                <BulkCardSearch
                  variant='purchases'
                  onConfirm={handleBulkSearchConfirm}
                  onCancel={handleBulkSearchCancel}
                  isOpen={isAdvancedSearchEnabled}
                />
              ) : (
                <CardSearchWithMetrics
                  onAddItem={addItem}
                  existingItemIds={existingItemIds}
                />
              )}
            </div>
          </EntitiesPage.CardContainer>
        )}

        <EntitiesPage.CardContainer>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Icon icon='lucide:list' width={18} className='text-accent' />
                <span className='text-sm font-semibold'>
                  Items de la compra
                </span>
                <Chip size='sm' variant='flat'>
                  {items.length} {items.length === 1 ? 'carta' : 'cartas'}
                </Chip>
              </div>
            </div>
            <PurchaseItemsList
              items={items}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
              isReadOnly={false}
            />
          </div>
        </EntitiesPage.CardContainer>

        <Divider />

        <div className='flex justify-end gap-3 pb-6'>
          <Button variant='bordered' onPress={() => router.push('/compras')}>
            Cancelar
          </Button>
          <Button
            className='bg-accent text-white'
            isDisabled={!canSave}
            isLoading={saving}
            onPress={handleSave}
            startContent={!saving && <Icon icon='lucide:save' width={18} />}
          >
            {saving ? 'Guardando...' : 'Guardar compra'}
          </Button>
        </div>
      </div>

      <SellerEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        onSubmit={handleUpdateSeller}
        seller={seller}
        isLoading={updating}
      />

      <SellerDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSeller}
        seller={seller}
        isLoading={deleting}
      />
    </EntitiesPage>
  );
}
