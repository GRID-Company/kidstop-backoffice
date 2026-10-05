import { ReactNode } from 'react';
import { Icon } from '@iconify/react';

type ScanStatusBannerVariant = 'error' | 'info' | 'warning';

interface ScanStatusBannerProps {
  variant: ScanStatusBannerVariant;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
}

const VARIANT_STYLES: Record<
  ScanStatusBannerVariant,
  { container: string; icon: string }
> = {
  error: {
    container: 'border-danger-200 bg-danger-50 text-danger-700',
    icon: 'lucide:alert-circle',
  },
  info: {
    container: 'border-primary-200 bg-primary-50 text-primary-700',
    icon: 'lucide:info',
  },
  warning: {
    container: 'border-warning-200 bg-warning-50 text-warning-700',
    icon: 'lucide:alert-triangle',
  },
};

export const ScanStatusBanner = ({
  variant,
  title,
  children,
  action,
}: ScanStatusBannerProps) => {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`rounded-lg border p-3 text-sm ${styles.container}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <div className='flex items-start gap-2'>
        <Icon icon={styles.icon} className='mt-0.5 shrink-0 text-base' />
        <div className='flex-1'>
          {title && <p className='mb-1 font-semibold'>{title}</p>}
          {children}
        </div>
        {action}
      </div>
    </div>
  );
};
