import { Tabs, Tab } from '@heroui/react';
import { EntitiesPage } from '@/shared/blocks/entities-page';
import { useSettings } from '../hooks/use-settings';
import { SETTINGS_SECTIONS, DEFAULT_GEOFENCE_CONFIG, DEFAULT_OPERATING_HOURS, DEFAULT_THRESHOLDS, DEFAULT_BANNER_CONFIG } from '../../domain/constants';
import GeneralSection from '../components/general-section';
import BudgetSection from '../components/budget-section';
import BannerSection from '../components/banner-section';

export default function Settings() {
  const {
    settings,
    budgets,
    buyers,
    loading,
    updatingConfig,
    updatingBudget,
    updateGeofence,
    updateThresholds,
    updateOperatingHours,
    updateBudget,
    updateBanners,
  } = useSettings();

  if (loading && !settings) return null;

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="Configuración">
        {settings && (
          <span className="text-sm text-default-400">
            Última actualización: {new Date(settings.updatedDate).toLocaleString('es-MX')}
          </span>
        )}
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <Tabs
          defaultSelectedKey="general"
          variant="underlined"
          classNames={{ tabList: 'mb-4' }}
        >
          <Tab key="general" title={SETTINGS_SECTIONS.general}>
            <GeneralSection
              geofence={settings?.geofence ?? DEFAULT_GEOFENCE_CONFIG}
              thresholds={settings?.thresholds ?? DEFAULT_THRESHOLDS}
              operatingHours={settings?.operatingHours ?? DEFAULT_OPERATING_HOURS}
              isLoading={updatingConfig}
              onSaveGeofence={updateGeofence}
              onSaveThresholds={updateThresholds}
              onSaveOperatingHours={updateOperatingHours}
            />
          </Tab>
          <Tab key="budgets" title={SETTINGS_SECTIONS.budgets}>
            <BudgetSection
              budgets={budgets}
              buyers={buyers}
              loading={updatingBudget}
              onSave={updateBudget}
            />
          </Tab>
          <Tab key="banners" title={SETTINGS_SECTIONS.banners}>
            <BannerSection
              banners={settings?.bannerGuids ?? DEFAULT_BANNER_CONFIG}
              isLoading={updatingConfig}
              onSave={updateBanners}
            />
          </Tab>
        </Tabs>
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
