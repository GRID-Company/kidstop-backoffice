import { Control } from 'react-hook-form';
import { ProfileForm } from '../../../adapters/forms/profile.form.schema';
import InputForm from '@/shared/base/form-controls/input-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import ColorSelectForm from '@/shared/blocks/color-selector/color-select-form';

interface ProfileFormProps {
  control: Control<ProfileForm>;
}

export default function ProfileFormBody({ control }: ProfileFormProps) {
  return (
    <div>
      <p className='text-content-tertiary text-xs font-semibold'>PERFILES</p>
      <p className='mb-4'>Información general</p>

      <InputForm
        label='Clave'
        placeholder='Ingresa la clave del producto'
        controlProps={{
          control,
          name: 'sku',
        }}
        className='mb-3'
      />

      <InputForm
        label='Nombre'
        placeholder='Ingresa el nombre del producto'
        controlProps={{
          control,
          name: 'name',
        }}
        className='mb-3'
      />

      <InputForm
        label='Proveedor'
        placeholder='Ingresa el proveedor del producto'
        controlProps={{
          control,
          name: 'supplier',
        }}
      />

      <p className='mt-12 mb-4'>Línea y color</p>
      <div className='grid grid-cols-2 gap-3'>
        <SelectForm
          label='Línea'
          placeholder='Elige o ingresa una línea'
          controlProps={{
            control,
            name: 'line',
          }}
          items={[
            {
              value: 'Línea de prueba 1',
              label: 'Línea de prueba 1',
            },
            {
              value: 'Línea de prueba 2',
              label: 'Línea de prueba 2',
            },
          ]}
        />
        <ColorSelectForm
          label='Color'
          placeholder='Elige un color'
          controlProps={{
            control,
            name: 'color',
          }}
        />
      </div>

      <p className='mt-12 mb-4'>Inventario</p>
      <div className='grid grid-cols-15 gap-3'>
        <InputForm
          label='Medida'
          placeholder='##'
          type='number'
          controlProps={{
            control,
            name: 'size',
          }}
          className='col-span-3'
        />
        <InputForm
          label='Mín unidades'
          placeholder='##'
          type='number'
          controlProps={{
            control,
            name: 'minStock',
          }}
          className='col-span-6'
        />
        <InputForm
          label='Unidades disponibles'
          placeholder='##'
          type='number'
          controlProps={{
            control,
            name: 'stock',
          }}
          className='col-span-6'
        />
      </div>

      <p className='mt-12 mb-4'>Precio unitario</p>
      <InputForm
        label='Precio unitario'
        placeholder='##'
        type='number'
        startContent='$'
        controlProps={{
          control,
          name: 'price',
        }}
      />
    </div>
  );
}
