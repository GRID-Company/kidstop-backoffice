import { InventoryType } from '@/features/inventory/domain/inventory-create.domain';
import { RadioGroup, Radio } from '@heroui/react';

interface TypeSelectorProps {
  type: InventoryType;
  setType: (type: InventoryType) => void;
}

export default function TypeSelector({ type, setType }: TypeSelectorProps) {
  return (
    <>
      <div>
        <p className=''>Tipo de producto</p>
        <p className='mb-4 text-sm text-gray-500'>
          Seleccione la categoría del nuevo producto
        </p>
      </div>

      <RadioGroup
        label=''
        value={type}
        onChange={(e) => setType(e.target.value as InventoryType)}
      >
        <Radio value='perfil'>Perfiles</Radio>
        <Radio value='herraje'>Herrajes</Radio>
        <Radio value='vidrio'>Vidrios</Radio>
        <Radio value='varios' isDisabled>
          Varios
        </Radio>
      </RadioGroup>
    </>
  );
}
