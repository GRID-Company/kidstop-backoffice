import KidstopCard from '@/shared/base/heorui-overrides/card';
import { CardBody } from '@heroui/react';
import { useWindowFormCtx } from './window-form.context';
import { WindowForm } from '@/features/windows/adapters/forms/window.form.schema';
import { GlassesQueryDefaultVariables } from '@/features/windows/domain/windows.domain';
import { SelectGlassesDocument } from '@/lib/api/generated/selectors.generated';
import FormAsyncAutocomplete from '@/shared/base/form-controls/form-async-autocomplete';
import { mapGlassesToItems } from '@/features/windows/adapters/mappers/glasses-to-items';

export default function WindowGlasses() {
  const { control } = useWindowFormCtx();

  return (
    <KidstopCard>
      <CardBody className='p-4'>
        <div className='flex items-center justify-between gap-8'>
          <p className='text-lg'>Vidrio</p>

          <FormAsyncAutocomplete<
            WindowForm,
            typeof SelectGlassesDocument,
            typeof GlassesQueryDefaultVariables
          >
            controlProps={{
              control,
              name: `glassInventoryItemGuid`,
            }}
            label='Vdrio'
            placeholder='Ingresa el nombre o la clave del vidrio'
            queryDocument={SelectGlassesDocument}
            variables={GlassesQueryDefaultVariables}
            mapResToItems={mapGlassesToItems}
            className='max-w-1/2'
          />
        </div>
      </CardBody>
    </KidstopCard>
  );
}
