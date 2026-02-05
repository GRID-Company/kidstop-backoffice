import CanalviCard from '@/shared/base/heorui-overrides/card';
import { Button, CardBody } from '@heroui/react';
import { useFieldArray } from 'react-hook-form';
import { useWindowFormCtx } from './window-form.context';
import {
  ChapesQueryDefaultVariables,
  DefaultChape,
} from '@/features/windows/domain/windows.domain';
import AddNewButton from '@/shared/base/buttons/add-new-button';
import InputForm from '@/shared/base/form-controls/input-form';
import { Icon } from '@iconify/react';
import SubwindowSelect from './subwindow-select';
import { WindowForm } from '@/features/windows/adapters/forms/window.form.schema';
import { mapChapesToItems } from '@/features/windows/adapters/mappers/chapes-to-items';
import { SelectChapesDocument } from '@/lib/api/generated/selectors.generated';
import FormAsyncAutocomplete from '@/shared/base/form-controls/form-async-autocomplete';

export default function WindowChapes() {
  const { control, isWindowSimple } = useWindowFormCtx();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'chapeWindows',
  });

  return (
    <CanalviCard>
      <CardBody className='p-4'>
        <div className='mb-4 flex items-center justify-between'>
          <p className='text-lg'>Herrajes</p>
          <AddNewButton
            size='sm'
            label='Agregar herraje'
            variant='bordered'
            onPress={() => append(DefaultChape)}
          />
        </div>

        {fields.map((field, index) => (
          <div
            className='bg-neutral-subtle relative rounded-lg p-4'
            key={field.id}
          >
            <div className='flex items-center gap-6'>
              <p className='text-sm'>Herraje {index + 1}</p>
              {!isWindowSimple && (
                <SubwindowSelect
                  controlProps={{
                    control,
                    name: `chapeWindows.${index}.subWindow`,
                  }}
                />
              )}
            </div>

            <div className='mt-4 grid grid-cols-2 gap-4'>
              <FormAsyncAutocomplete<
                WindowForm,
                typeof SelectChapesDocument,
                typeof ChapesQueryDefaultVariables
              >
                controlProps={{
                  control,
                  name: `chapeWindows.${index}.chapeInventoryItemGuid`,
                }}
                label='Herraje'
                placeholder='Ingresa el nombre o la clave del herraje'
                queryDocument={SelectChapesDocument}
                variables={ChapesQueryDefaultVariables}
                mapResToItems={mapChapesToItems}
              />
              <InputForm
                label='Cantidad'
                placeholder='##'
                controlProps={{
                  control,
                  name: `chapeWindows.${index}.quantity`,
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
    </CanalviCard>
  );
}
