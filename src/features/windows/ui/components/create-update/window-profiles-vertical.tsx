import CanalviCard from '@/shared/base/heorui-overrides/card';
import { CardBody } from '@heroui/react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useWindowFormCtx } from './window-form.context';
import AddNewButton from '@/shared/base/buttons/add-new-button';
import InputForm from '@/shared/base/form-controls/input-form';
import {
  DefaultProfile,
  ProfilesQueryDefaultVariables,
} from '@/features/windows/domain/windows.domain';
import CloseButton from '@/shared/base/buttons/close-button';
import SubwindowSelect from './subwindow-select';
import FormAsyncAutocomplete from '@/shared/base/form-controls/form-async-autocomplete';
import { SelectProfilesDocument } from '@/lib/api/generated/selectors.generated';
import { WindowForm } from '@/features/windows/adapters/forms/window.form.schema';
import { mapProfilesToItems } from '@/features/windows/adapters/mappers/profiles-to-items';

export default function WindowProfilesVertical() {
  const { control, isWindowSimple } = useWindowFormCtx();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'verticalProfiles',
  });

  return (
    <CanalviCard>
      <CardBody className='p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <p className='text-lg'>Perfiles verticales</p>
          <AddNewButton
            size='sm'
            label='Agregar perfil'
            variant='bordered'
            onPress={() => append(DefaultProfile)}
          />
        </div>

        {fields.map((field, index) => (
          <div
            className='bg-neutral-subtle relative mb-4 rounded-lg p-4 last:mb-0'
            key={field.id}
          >
            <div className='flex items-center gap-6'>
              <p className='text-sm'>Perfil vertical {index + 1}</p>
              {!isWindowSimple && (
                <SubwindowSelect
                  controlProps={{
                    control,
                    name: `verticalProfiles.${index}.subWindow`,
                  }}
                />
              )}
            </div>

            <div className='mt-4 grid grid-cols-2 gap-4'>
              <FormAsyncAutocomplete<
                WindowForm,
                typeof SelectProfilesDocument,
                typeof ProfilesQueryDefaultVariables
              >
                controlProps={{
                  control,
                  name: `verticalProfiles.${index}.inventoryItemSKU`,
                }}
                label='Perfil'
                placeholder='Ingresa el nombre o la clave del perfil'
                queryDocument={SelectProfilesDocument}
                variables={ProfilesQueryDefaultVariables}
                mapResToItems={mapProfilesToItems}
                className='col-span-2'
              />

              <InputForm
                label='Cantidad'
                placeholder='##'
                controlProps={{
                  control,
                  name: `verticalProfiles.${index}.quantity`,
                }}
                type='number'
              />

              <InputForm
                label='Porcentaje'
                placeholder='##'
                controlProps={{
                  control,
                  name: `verticalProfiles.${index}.size`,
                }}
                type='number'
              />
            </div>

            {fields.length > 1 && (
              <CloseButton
                onPress={() => remove(index)}
                className='absolute -top-2 -right-2'
              />
            )}
          </div>
        ))}
      </CardBody>
    </CanalviCard>
  );
}
