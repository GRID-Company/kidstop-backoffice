import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ScanEmptyStateProps {
  title: string;
  message?: string;
  tips?: string[];
  onRescan: () => void;
  onRetry?: () => void;
}

export const ScanEmptyState = ({
  title,
  message,
  tips,
  onRescan,
  onRetry,
}: ScanEmptyStateProps) => {
  return (
    <div className='border-divider rounded-lg border bg-white p-5 text-center'>
      <div className='bg-neutral-subtle mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full'>
        <Icon
          icon='lucide:search-x'
          width={24}
          className='text-content-tertiary'
        />
      </div>

      <h4 className='text-content-primary text-sm font-semibold'>{title}</h4>

      {message && (
        <p className='text-content-tertiary mt-1 text-xs'>{message}</p>
      )}

      {tips && tips.length > 0 && (
        <ul className='mt-4 flex flex-col gap-2 text-left'>
          {tips.map((tip, index) => (
            <li
              key={index}
              className='text-content-tertiary flex items-start gap-2 text-xs'
            >
              <Icon
                icon='lucide:check'
                width={14}
                className='text-success mt-0.5 shrink-0'
              />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}

      <div className='mt-4 flex flex-col gap-2'>
        <Button
          size='md'
          className='bg-accent w-full font-semibold text-white'
          onPress={onRescan}
          startContent={<Icon icon='lucide:camera' width={16} />}
        >
          Nueva captura
        </Button>
        {onRetry && (
          <Button
            size='md'
            variant='flat'
            className='text-content-primary w-full'
            onPress={onRetry}
            startContent={<Icon icon='lucide:rotate-cw' width={14} />}
          >
            Reintentar búsqueda
          </Button>
        )}
      </div>
    </div>
  );
};
