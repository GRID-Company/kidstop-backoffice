import { Tabs, Tab } from '@heroui/react';
import { EntitiesPage } from '@/shared/blocks/entities-page';
import { useSettings } from '../hooks/use-settings';
import { SETTINGS_SECTIONS } from '../../domain/constants';
import GeneralSection from '../components/general-section';
import BudgetSection from '../components/budget-section';

export default function Settings() {
  const {
    settings,
    loading,
    updateGeofence,
    updateBudgets,
    updateThresholds,
    updateOperatingHours,
  } = useSettings();

  if (loading) return null;

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label="Configuración">
        <span className="text-sm text-default-400">
          Última actualización: {new Date(settings.updatedAt).toLocaleString('es-MX')}
        </span>
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <Tabs
          defaultSelectedKey="general"
          variant="underlined"
          classNames={{ tabList: 'mb-4' }}
        >
          <Tab key="general" title={SETTINGS_SECTIONS.general}>
            <GeneralSection
              geofence={settings.geofence}
              thresholds={settings.thresholds}
              operatingHours={settings.operatingHours}
              onSaveGeofence={updateGeofence}
              onSaveThresholds={updateThresholds}
              onSaveOperatingHours={updateOperatingHours}
            />
          </Tab>
          <Tab key="budgets" title={SETTINGS_SECTIONS.budgets}>
            <BudgetSection
              budgets={settings.budgets}
              onSave={updateBudgets}
            />
          </Tab>
        </Tabs>
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
