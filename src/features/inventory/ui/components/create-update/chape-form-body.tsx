import { Control } from 'react-hook-form';
import { ChapeForm } from '../../../adapters/forms/chape.form.schema';
import InputForm from '@/shared/base/form-controls/input-form';
import SelectForm from '@/shared/base/form-controls/select-form';
import ColorSelectForm from '@/shared/blocks/color-selector/color-select-form';

interface ChapeFormProps {
  control: Control<ChapeForm>;
}
export default function ChapeFormBody({ control }: ChapeFormProps) {
  return (
    <div>
      <p className='text-content-tertiary text-xs font-semibold'>HERRAJES</p>
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
      <div className='grid grid-cols-12 gap-3'>
        <InputForm
          label='Mín unidades'
          placeholder='##'
          type='number'
          controlProps={{
            control,
            name: 'minStock',
          }}
          className='col-span-4'
        />
        <InputForm
          label='Unidades disponibles'
          placeholder='##'
          type='number'
          controlProps={{
            control,
            name: 'stock',
          }}
          className='col-span-4'
        />
        <SelectForm
          label='Medida'
          placeholder='Elige una unidad de medida'
          controlProps={{
            control,
            name: 'unitMeasure',
          }}
          items={[
            {
              value: 'PIECE',
              label: 'pza(s)',
            },
          ]}
          className='col-span-4'
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
