import InputForm from '@/shared/base/form-controls/input-form';
import TextareaForm from '@/shared/base/form-controls/textarea-form';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import { CardBody, Divider, Radio } from '@heroui/react';
import { useWindowFormCtx } from './window-form.context';
import RadioForm from '@/shared/base/form-controls/radio-form';
import { useWatch } from 'react-hook-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import { WindowTypeOptions } from '@/features/windows/domain/windows.domain';

export default function WindowInformation() {
  const { control, isWindowSimple } = useWindowFormCtx();

  const windowType = useWatch({
    control,
    name: 'subWindows.0.windowType',
  });
  const windowTypeTwo = useWatch({
    control,
    name: 'subWindows.1.windowType',
  });

  return (
    <KidstopCard>
      <CardBody className='p-4'>
        <p className='mb-4 text-lg'>Información general</p>

        <InputForm
          label='Nombre'
          placeholder='Ingresa el nombre de la ventana'
          controlProps={{
            control,
            name: 'name',
          }}
          className='mb-2'
        />

        <TextareaForm
          label='Descripción'
          placeholder='Ingresa la descripción de la ventana'
          controlProps={{
            control,
            name: 'description',
          }}
          className='mb-2'
        />

        <p className='mt-6 mb-4 text-lg'>Tipo de ventana</p>

        <RadioForm
          orientation='horizontal'
          controlProps={{
            control,
            name: 'windowComplexity',
          }}
          className='mb-6'
          classNames={{
            wrapper: 'w-full justify-between',
          }}
        >
          <Radio value='SIMPLE'>Ventana sencilla</Radio>
          <Radio value='COMPLEX'>Ventana compuesta</Radio>
        </RadioForm>

        {isWindowSimple && (
          <>
            <SelectForm
              label='Tipo de ventana'
              placeholder='Elige el tipo de ventana'
              controlProps={{
                control,
                name: 'subWindows.0.windowType',
              }}
              items={WindowTypeOptions}
              className='mb-2'
            />
            {windowType === 'PROJECTION' && (
              <InputForm
                label='Cantidad de proyecciones'
                placeholder='##'
                controlProps={{
                  control,
                  name: 'subWindows.0.projectionQuantity',
                }}
              />
            )}
          </>
        )}

        {!isWindowSimple && (
          <>
            <SelectForm
              label='Tipo de ventana'
              placeholder='Elige el tipo de ventana'
              controlProps={{
                control,
                name: 'subWindows.0.windowType',
              }}
              className='mb-2'
              items={WindowTypeOptions}
              disabledKeys={[windowTypeTwo]}
            />

            {windowType === 'PROJECTION' && (
              <InputForm
                label='Cantidad de proyecciones'
                placeholder='##'
                controlProps={{
                  control,
                  name: 'subWindows.0.projectionQuantity',
                }}
              />
            )}

            <Divider className='my-4' />

            <SelectForm
              label='Tipo de ventana'
              placeholder='Elige el tipo de ventana'
              controlProps={{
                control,
                name: 'subWindows.1.windowType',
              }}
              className='mb-2'
              items={WindowTypeOptions}
              disabledKeys={[windowType]}
            />

            {windowTypeTwo === 'PROJECTION' && (
              <InputForm
                label='Cantidad de proyecciones'
                placeholder='##'
                controlProps={{
                  control,
                  name: 'subWindows.1.projectionQuantity',
                }}
              />
            )}
          </>
        )}
      </CardBody>
    </KidstopCard>
  );
}
