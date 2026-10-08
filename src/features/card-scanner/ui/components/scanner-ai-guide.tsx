import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { Icon } from '@iconify/react';

export const ScannerAiGuide = () => {
  return (
    <Popover placement='bottom-start' showArrow>
      <PopoverTrigger>
        <Button
          isIconOnly
          radius='full'
          size='sm'
          aria-label='¿Cuándo usar la búsqueda con IA?'
          className='h-10 w-10 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70'
        >
          <Icon icon='lucide:circle-help' width={18} aria-hidden='true' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='max-w-72 p-3'>
        <div className='flex flex-col gap-3 text-xs'>
          <p className='text-content-primary text-sm font-semibold'>
            ¿Cuándo usar la búsqueda con IA?
          </p>

          <div>
            <p className='text-content-primary font-medium'>
              No hace falta forzarla si:
            </p>
            <ul className='text-content-secondary mt-1 flex list-disc flex-col gap-1 pl-4'>
              <li>
                La carta está en inglés o el nombre no se ve afectado por el
                idioma (común en Pokémon entre inglés y español)
              </li>
              <li>Tienes buena iluminación o una buena cámara</li>
            </ul>
          </div>

          <div>
            <p className='text-content-primary font-medium'>Actívala cuando:</p>
            <ul className='text-content-secondary mt-1 flex list-disc flex-col gap-1 pl-4'>
              <li>La carta no está en inglés</li>
              <li>No tienes buena iluminación</li>
              <li>
                Ya intentaste sin forzarla y no obtuviste buenos resultados
              </li>
            </ul>
          </div>

          <p className='text-content-tertiary'>
            La búsqueda con IA es más costosa — en las condiciones anteriores el
            escaneo normal suele dar buenos resultados.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
