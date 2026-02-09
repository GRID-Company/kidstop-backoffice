import KidstopCard from '@/shared/base/heorui-overrides/card';
import { Button, CardBody } from '@heroui/react';
import { useFieldArray } from 'react-hook-form';
import { useWindowFormCtx } from './window-form.context';
import {
  DefaultProfile,
  ProfilesQueryDefaultVariables,
} from '@/features/windows/domain/windows.domain';
import AddNewButton from '@/shared/base/buttons/add-new-button';
import InputForm from '@/shared/base/form-controls/input-form';
import { Icon } from '@iconify/react';
import SubwindowSelect from './subwindow-select';
import { WindowForm } from '@/features/windows/adapters/forms/window.form.schema';
import { mapProfilesToItems } from '@/features/windows/adapters/mappers/profiles-to-items';
import { SelectProfilesDocument } from '@/lib/api/generated/selectors.generated';
import FormAsyncAutocomplete from '@/shared/base/form-controls/form-async-autocomplete';

export default function WindowProfilesHorizontal() {
  const { control, isWindowSimple } = useWindowFormCtx();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'horizontalProfiles',
  });

  return (
    <KidstopCard>
      <CardBody className='p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <p className='text-lg'>Perfiles horizontales</p>
          <AddNewButton
            size='sm'
            label='Agregar perfil'
            variant='bordered'
            onPress={() => append(DefaultProfile)}
          />
        </div>

        {fields.map((field, index) => (
          <div
            className='bg-neutral-subtle relative rounded-lg p-4'
            key={field.id}
          >
            <div className='flex items-center gap-6'>
              <p className='text-sm'>Perfil vertical {index + 1}</p>
              {!isWindowSimple && (
                <SubwindowSelect
                  controlProps={{
                    control,
                    name: `horizontalProfiles.${index}.subWindow`,
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
                  name: `horizontalProfiles.${index}.inventoryItemSKU`,
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
                  name: `horizontalProfiles.${index}.quantity`,
                }}
                type='number'
              />

              <InputForm
                label='Porcentaje'
                placeholder='##'
                controlProps={{
                  control,
                  name: `horizontalProfiles.${index}.size`,
                }}
                type='number'
              />
            </div>

            {fields.length > 1 && (
              <Button
                color='danger'
                isIconOnly
                radius='full'
                onPress={() => remove(index)}
                size='sm'
                className='absolute -top-2 -right-2'
              >
                <Icon
                  icon='material-symbols:close-rounded'
                  className='text-lg text-white'
                />
              </Button>
            )}
          </div>
        ))}
      </CardBody>
    </KidstopCard>
  );
}
