import { Tabs, Tab } from '@heroui/react';
import { useState } from 'react';
import { EntitiesPage } from '@/shared/blocks/entities-page';
import { useSettings } from '../hooks/use-settings';
import { SETTINGS_SECTIONS } from '../../domain/constants';
import { SettingsSection } from '../../domain/types';
import GeneralSection from '../components/general-section';
import BudgetSection from '../components/budget-section';

export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
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
          selectedKey={activeSection}
          onSelectionChange={(key) => setActiveSection(key as SettingsSection)}
          variant="underlined"
          classNames={{ tabList: 'mb-4' }}
        >
          {Object.entries(SETTINGS_SECTIONS).map(([key, label]) => (
            <Tab key={key} title={label}>
              {key === 'general' && (
                <GeneralSection
                  geofence={settings.geofence}
                  thresholds={settings.thresholds}
                  operatingHours={settings.operatingHours}
                  onSaveGeofence={updateGeofence}
                  onSaveThresholds={updateThresholds}
                  onSaveOperatingHours={updateOperatingHours}
                />
              )}
              {key === 'budgets' && (
                <BudgetSection
                  budgets={settings.budgets}
                  onSave={updateBudgets}
                />
              )}
            </Tab>
          ))}
        </Tabs>
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
