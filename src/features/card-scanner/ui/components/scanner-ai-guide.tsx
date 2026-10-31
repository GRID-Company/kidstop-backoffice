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
            Niveles de búsqueda
          </p>

          <div>
            <p className='text-content-primary font-medium'>Normal</p>
            <p className='text-content-secondary mt-1'>
              Busca en el catálogo primero y usa IA solo como respaldo.
              Suficiente si la carta está en inglés, con buena iluminación o
              buena cámara.
            </p>
          </div>

          <div>
            <p className='text-content-primary font-medium'>IA</p>
            <p className='text-content-secondary mt-1'>
              La IA resuelve la carta primero (Gemini Flash). Úsala cuando la
              carta no está en inglés, hay mala iluminación o el modo Normal no
              dio buenos resultados.
            </p>
          </div>

          <div>
            <p className='text-content-primary font-medium'>IA Pro</p>
            <p className='text-content-secondary mt-1'>
              Igual que IA pero con Gemini Pro: máxima precisión, más lento y
              más costoso. Para cartas difíciles que los otros modos no
              resolvieron.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
