import { Control } from 'react-hook-form';
import { GlassForm } from '../../../adapters/forms/glass.form.schema';
import InputForm from '@/shared/base/form-controls/input-form';

interface GlassFormProps {
  control: Control<GlassForm>;
}

export default function GlassFormBody({ control }: GlassFormProps) {
  return (
    <div>
      <p className='text-content-tertiary text-xs font-semibold'>VIDRIOS</p>
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

      <p className='mt-12 mb-4'>Grosor</p>
      <InputForm
        label='Grosor'
        placeholder='##'
        type='number'
        endContent='mm'
        controlProps={{
          control,
          name: 'thickness',
        }}
      />

      <p className='mt-12 mb-4'>Inventario</p>
      <div className='grid grid-cols-2 gap-3'>
        <InputForm
          label='Mín unidades'
          placeholder='##'
          type='number'
          controlProps={{
            control,
            name: 'minStock',
          }}
        />
        <InputForm
          label='Unidades disponibles'
          placeholder='##'
          type='number'
          controlProps={{
            control,
            name: 'stock',
          }}
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
