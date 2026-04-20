import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { CombinedGraphQLErrors } from '@apollo/client';
import toast from 'react-hot-toast';
import {
  GlobalConfigDocument,
  UpdateGlobalConfigDocument,
} from '@/lib/api/generated/settings.generated';
import {
  BuyerBudgetsDocument,
  UpdateBuyerBudgetDocument,
} from '@/lib/api/generated/buyer-budgets.generated';
import { UsersDocument } from '@/lib/api/generated/users.generated';
import { UploadFileDocument } from '@/lib/api/generated/files.generated';
import { IGeofenceConfig, IOperatingHours, IThresholdConfig, IBannerConfig } from '../../domain/types';
import {
  fromApiToSettings,
  toGeofenceMutationInput,
  toOperatingHoursMutationInput,
  toThresholdsMutationInput,
} from '../../adapters/mappers/settings.mapper';
import {
  fromApiBudgets,
  toUpdateBuyerBudgetPayload,
} from '../../adapters/mappers/buyer-budget.mapper';
import { toBannerMutationInput } from '../../adapters/mappers/banner.mapper';
import { BudgetFormData } from '../../adapters/forms/budget-settings.schema';

export function useSettings() {
  const { data: configData, loading: configLoading } = useQuery(GlobalConfigDocument, {
    fetchPolicy: 'cache-first',
  });

  const { data: budgetsData, loading: budgetsLoading } = useQuery(BuyerBudgetsDocument, {
    fetchPolicy: 'cache-and-network',
  });

  const { data: buyersData } = useQuery(UsersDocument, {
    variables: {
      findUsersArgs: {
        skip: 0,
        limit: 100,
        sort: { column: 'name', order: 'ASC' },
        filters: { role: { filterType: ':multiple_values:', values: ['BUYER'] } },
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const [updateConfigMutation, { loading: updatingConfig }] = useMutation(
    UpdateGlobalConfigDocument,
    { refetchQueries: [GlobalConfigDocument] }
  );

  const [updateBudgetMutation, { loading: updatingBudget }] = useMutation(
    UpdateBuyerBudgetDocument,
    { refetchQueries: [BuyerBudgetsDocument] }
  );

  const [uploadFileMutation] = useMutation(UploadFileDocument);

  const settings = configData ? fromApiToSettings(configData.globalConfig) : null;
  const budgets = budgetsData ? fromApiBudgets(budgetsData.buyerBudgets) : [];
  const buyers = buyersData?.users.data ?? [];

  const updateGeofence = useCallback(
    async (geofence: IGeofenceConfig) => {
      try {
        await updateConfigMutation({
          variables: { updateGlobalConfigInput: toGeofenceMutationInput(geofence) },
        });
        toast.success('Geofence actualizado');
      } catch (error) {
        const message = CombinedGraphQLErrors.is(error) ? error.errors[0]?.message : undefined;
        toast.error(message ?? 'Error al actualizar geofence');
      }
    },
    [updateConfigMutation]
  );

  const updateThresholds = useCallback(
    async (thresholds: IThresholdConfig) => {
      try {
        await updateConfigMutation({
          variables: { updateGlobalConfigInput: toThresholdsMutationInput(thresholds) },
        });
        toast.success('Umbrales actualizados');
      } catch (error) {
        const message = CombinedGraphQLErrors.is(error) ? error.errors[0]?.message : undefined;
        toast.error(message ?? 'Error al actualizar umbrales');
      }
    },
    [updateConfigMutation]
  );

  const updateOperatingHours = useCallback(
    async (operatingHours: IOperatingHours) => {
      try {
        await updateConfigMutation({
          variables: { updateGlobalConfigInput: toOperatingHoursMutationInput(operatingHours) },
        });
        toast.success('Horarios actualizados');
      } catch (error) {
        const message = CombinedGraphQLErrors.is(error) ? error.errors[0]?.message : undefined;
        toast.error(message ?? 'Error al actualizar horarios');
      }
    },
    [updateConfigMutation]
  );

  const updateBudget = useCallback(
    async (form: BudgetFormData) => {
      try {
        await updateBudgetMutation({ variables: toUpdateBuyerBudgetPayload(form) });
        toast.success('Presupuesto actualizado');
      } catch (error) {
        const message = CombinedGraphQLErrors.is(error) ? error.errors[0]?.message : undefined;
        toast.error(message ?? 'Error al actualizar presupuesto');
      }
    },
    [updateBudgetMutation]
  );

  const updateBanners = useCallback(
    async (pokemonFile?: File, magicFile?: File) => {
      try {
        const bannerGuids: IBannerConfig = {
          pokemon: settings?.bannerGuids?.pokemon,
          magic: settings?.bannerGuids?.magic,
        };

        if (pokemonFile) {
          const { data: pokemonData } = await uploadFileMutation({
            variables: {
              uploadFileArgs: {
                file: pokemonFile,
                name: pokemonFile.name,
                category: 'TECHNICAL_IMAGE',
              },
            },
          });
          bannerGuids.pokemon = pokemonData?.uploadFile?.guid;
        }

        if (magicFile) {
          const { data: magicData } = await uploadFileMutation({
            variables: {
              uploadFileArgs: {
                file: magicFile,
                name: magicFile.name,
                category: 'TECHNICAL_IMAGE',
              },
            },
          });
          bannerGuids.magic = magicData?.uploadFile?.guid;
        }

        await updateConfigMutation({
          variables: { updateGlobalConfigInput: toBannerMutationInput(bannerGuids) },
        });

        toast.success('Banners actualizados correctamente');
      } catch (error) {
        const message = CombinedGraphQLErrors.is(error) ? error.errors[0]?.message : undefined;
        toast.error(message ?? 'Error al actualizar banners');
        throw error;
      }
    },
    [uploadFileMutation, updateConfigMutation, settings?.bannerGuids]
  );

  return {
    settings,
    budgets,
    buyers,
    loading: configLoading || budgetsLoading,
    updatingConfig,
    updatingBudget,
    updateGeofence,
    updateThresholds,
    updateOperatingHours,
    updateBudget,
    updateBanners,
  };
}
