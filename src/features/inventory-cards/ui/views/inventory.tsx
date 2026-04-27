'use client';

import { useCallback, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { Button, Tab, Tabs, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Key } from 'react';
import { TCG_TYPES } from '@/lib/types/tcg.types';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import BulkCardSearch from '@/shared/blocks/bulk-card-search';
import { BulkSearchFormDataInventory } from '@/shared/blocks/bulk-card-search/schemas';
import Drawer from '@/shared/base/heorui-overrides/drawer';
import { formatDateTime } from '@/lib/utils/format-date';
import { IInventoryItem } from '../../domain/types';
import { InventoryAdjustmentFormData } from '../../adapters/forms/inventory-adjustment.form.schema';
import { IPokemonCard, IMagicCard } from '@/features/catalog/domain/types';
import { mapBulkSearchToInventoryInput } from '../../adapters/mappers/bulk-search-to-inventory.mapper';
import {
  CreateInventoryMovementDocument,
  InventoryItemsDocument,
  InventoryMovementsDocument,
  IndicatorsInventoryItemsDocument,
} from '@/lib/api/generated/inventory.generated';
import { toAdjustInventoryPayload } from '../../adapters/mappers/inventory.mapper';
import { useInventorySearch } from '../hooks/use-inventory-search';
import { useInventoryIndicators } from '../hooks/use-inventory-indicators';
import InventoryMetrics from '../components/inventory-metrics';
import InventoryFilters from '../components/inventory-filters';
import InventoryGrid from '../components/inventory-grid';
import AdjustmentModal from '../components/adjustment-modal';
import MovementsContent from './movements';
import PokemonCardDetailModal from '@/features/catalog/ui/components/pokemon-card-detail-modal';
import MagicCardDetailModal from '@/features/catalog/ui/components/magic-card-detail-modal';

const INVENTORY_TABS = {
  STOCK: 'stock',
  MOVEMENTS: 'movements',
} as const;

export default function Inventory() {
  const [activeTab, setActiveTab] = useState<string>(INVENTORY_TABS.STOCK);

  const {
    setSearch,
    handleFilterChange,
    dateRange,
    handleDateRangeChange,
    resetFilters,
    items,
    hasActiveFilters,
    selectedTCG,
    sortDescriptor,
    setSortDescriptor,
    page,
    setPage,
    totalPages,
    totalCount,
    loading,
    refetch,
  } = useInventorySearch();

  const { refresh: refreshIndicators, ...indicators } = useInventoryIndicators(selectedTCG);

  const [selectedItem, setSelectedItem] = useState<IInventoryItem | null>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [detailModalItem, setDetailModalItem] = useState<IPokemonCard | IMagicCard | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isBulkAddDrawerOpen, setIsBulkAddDrawerOpen] = useState(false);

  const toCatalogCard = useCallback((item: IInventoryItem): IPokemonCard | IMagicCard => {
    if (item.tcg === 'MAGIC') {
      return {
        guid: item.cardGuid,
        name: item.name,
        edition: item.setName,
        collectorNumber: item.number,
        isFoil: false,
        rarity: item.rarity,
        sellPrice: item.sellPrice,
        availableStock: item.stock > 0,
        totalStock: item.stock,
        imageUri: item.imageUrl,
        variants: [{
          guid: item.guid,
          condition: item.condition,
          stock: item.stock,
          purchasePrice: item.purchasePrice,
          sellPrice: item.sellPrice,
        }],
      };
    }
    return {
      guid: item.cardGuid,
      name: item.name,
      cardNumber: item.number,
      setName: item.setName,
      setCode: item.setCode,
      sellPrice: item.sellPrice,
      availableStock: item.stock > 0,
      totalStock: item.stock,
      imageUri: item.imageUrl,
      variants: [{
        guid: item.guid,
        condition: item.condition,
        stock: item.stock,
        purchasePrice: item.purchasePrice,
        sellPrice: item.sellPrice,
      }],
    };
  }, []);

  const handleItemPress = useCallback((item: IInventoryItem) => {
    const catalogCard = toCatalogCard(item);
    setDetailModalItem(catalogCard);
    setIsDetailModalOpen(true);
  }, [toCatalogCard]);

  const handleCloseDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setDetailModalItem(null);
    void refetch();
    void refreshIndicators();
  }, [refetch, refreshIndicators]);

  const handleCloseAdjustment = useCallback(() => {
    setIsAdjustmentOpen(false);
    setSelectedItem(null);
  }, []);

  const [createMovement, { loading: adjusting }] = useMutation(
    CreateInventoryMovementDocument,
    {
      refetchQueries: [
        InventoryItemsDocument,
        InventoryMovementsDocument,
        IndicatorsInventoryItemsDocument,
      ],
    }
  );

  const handleAdjustmentSubmit = useCallback(
    async (data: InventoryAdjustmentFormData) => {
      try {
        await createMovement({ variables: toAdjustInventoryPayload(data) });
        toast.success('Movimiento registrado correctamente');
        handleCloseAdjustment();
      } catch {
        toast.error('Error al registrar el movimiento');
      }
    },
    [createMovement, handleCloseAdjustment]
  );

  const handleTabChange = useCallback((key: Key) => {
    setActiveTab(key as string);
  }, []);

  const handleBulkAddConfirm = useCallback(
    (data: BulkSearchFormDataInventory) => {
      try {
        const input = mapBulkSearchToInventoryInput(data, selectedTCG);
        toast.success(`${input.items.length} cartas agregadas al inventario`);
        setIsBulkAddDrawerOpen(false);
        refetch();
        refreshIndicators();
      } catch (error) {
        toast.error('Error al agregar cartas al inventario');
      }
    },
    [selectedTCG, refetch, refreshIndicators]
  );

  const handleBulkAddCancel = useCallback(() => {
    setIsBulkAddDrawerOpen(false);
  }, []);

  return (
    <>
      <EntitiesPage>
        <EntitiesPage.Toolbar label="Inventario de Cartas">
          {activeTab === INVENTORY_TABS.STOCK && (
            <div className="flex gap-2">
              <Button
                variant="bordered"
                startContent={<Icon icon="lucide:upload" />}
                onPress={() => setIsBulkAddDrawerOpen(true)}
              >
                Agregar bulk
              </Button>
              <Button
                className="text-white"
                style={{ backgroundColor: 'var(--color-accent)' }}
                startContent={<Icon icon="lucide:plus" />}
                onPress={() => setIsAdjustmentOpen(true)}
              >
                Ajuste manual
              </Button>
            </div>
          )}
        </EntitiesPage.Toolbar>

        <EntitiesPage.CardContainer>
          <div className="mb-6 flex items-center justify-between">
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={handleTabChange}
              variant="underlined"
              classNames={{
                tabList: 'gap-6',
                cursor: 'bg-accent',
                tab: 'px-0 h-10',
                tabContent: 'group-data-[selected=true]:text-accent font-medium',
              }}
            >
              <Tab
                key={INVENTORY_TABS.STOCK}
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:package" />
                    <span>Stock</span>
                  </div>
                }
              />
              <Tab
                key={INVENTORY_TABS.MOVEMENTS}
                title={
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:arrow-left-right" />
                    <span>Movimientos</span>
                  </div>
                }
              />
            </Tabs>
            
            <div className="flex items-center gap-1">
              {indicators.lastRefresh && (
                <span className="text-[11px] text-default-400">
                  Act.: {formatDateTime(indicators.lastRefresh, '—')}
                </span>
              )}
              <Tooltip content="Actualizar indicadores">
                <Button
                  variant="light"
                  isIconOnly
                  size="sm"
                  onPress={refreshIndicators}
                  isLoading={indicators.loading}
                >
                  <Icon icon="lucide:refresh-cw" className="text-default-500" />
                </Button>
              </Tooltip>
            </div>
          </div>

          {activeTab === INVENTORY_TABS.STOCK && (
            <>
              <div className="mb-6">
                <InventoryMetrics
                  totalStock={indicators.totalStock}
                  lastSellDate={indicators.lastSellDate}
                  avgDaysInInventory={indicators.avgDaysInInventory}
                  loading={indicators.loading}
                />
              </div>

              <div className="mb-6">
                <InventoryFilters
                  onSearchChange={setSearch}
                  onFilterChange={handleFilterChange}
                  onDateRangeChange={handleDateRangeChange}
                  onReset={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                  resultCount={totalCount}
                  selectedTCG={selectedTCG}
                  dateRange={dateRange}
                />
              </div>

              <InventoryGrid
                items={items}
                totalItems={totalCount}
                isLoading={loading}
                page={page}
                totalPages={totalPages}
                sortDescriptor={sortDescriptor}
                onPageChange={setPage}
                onSortChange={setSortDescriptor}
                onItemPress={handleItemPress}
              />
            </>
          )}

          {activeTab === INVENTORY_TABS.MOVEMENTS && <MovementsContent />}
        </EntitiesPage.CardContainer>
      </EntitiesPage>

      <AdjustmentModal
        item={selectedItem}
        isOpen={isAdjustmentOpen}
        isSubmitting={adjusting}
        onClose={handleCloseAdjustment}
        onSubmit={handleAdjustmentSubmit}
      />

      <PokemonCardDetailModal
        card={detailModalItem && 'setName' in detailModalItem ? detailModalItem : null}
        isOpen={isDetailModalOpen && detailModalItem !== null && 'setName' in detailModalItem}
        onClose={handleCloseDetailModal}
      />

      <MagicCardDetailModal
        card={detailModalItem && 'edition' in detailModalItem ? detailModalItem : null}
        isOpen={isDetailModalOpen && detailModalItem !== null && 'edition' in detailModalItem}
        onClose={handleCloseDetailModal}
      />

      <Drawer
        isOpen={isBulkAddDrawerOpen}
        onClose={handleBulkAddCancel}
        title="Agregar cartas en bulk"
        size="xl"
      >
        <div className="p-4">
          <BulkCardSearch
            variant="inventory"
            onConfirm={handleBulkAddConfirm}
            onCancel={handleBulkAddCancel}
            isOpen={isBulkAddDrawerOpen}
          />
        </div>
      </Drawer>
    </>
  );
}
