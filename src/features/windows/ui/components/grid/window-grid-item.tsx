import { WindowTemplate } from '@/lib/api/schema-types';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import MosquitoNetPill from '@/features/windows/ui/components/grid/mosquito-net-pill';
import { Card, CardBody, CardFooter, CardHeader, Image } from '@heroui/react';

export default function WindowGridItem({
  window,
}: {
  window: Partial<WindowTemplate>;
}) {
  return (
    <KidstopCard>
      <CardHeader className='relative aspect-video h-auto w-full overflow-visible bg-gray-200 p-0'>
        <Image
          alt={window?.name || 'Ventana'}
          className='h-full w-full object-cover'
          radius='none'
          src={window?.technicalImage?.path || ''}
          width='100%'
        />
        <MosquitoNetPill
          hasMosquitoNet={window?.hasMosquitoNet || false}
          className='absolute top-4 right-4 z-10'
        />
      </CardHeader>

      <CardBody className='text-small text-content-primary block justify-between'>
        <p className='mb-4 text-lg font-semibold'>
          {window?.name || 'Ventana'}
        </p>
        <p className='font-medium'>
          <span className='text-content-tertiary'>Tipo: </span>
          {window?.windowTypes?.join(', ')}
        </p>
        <p className='font-medium'>
          <span className='text-content-tertiary'>Línea: </span>
          {/* {window?.line} */} -
        </p>
        <div className='items flex gap-4'>
          <p className='font-medium'>
            <span className='text-content-tertiary'>Perfiles h: </span>
            {window?.subWindows?.reduce(
              (acc, subWindow) => acc + subWindow.horizontalProfiles.length,
              0
            )}
          </p>
          |
          <p className='font-medium'>
            <span className='text-content-tertiary'>Perfiles v: </span>
            {window?.subWindows?.reduce(
              (acc, subWindow) => acc + subWindow.verticalProfiles.length,
              0
            )}
          </p>
        </div>
      </CardBody>
    </KidstopCard>
  );
}
