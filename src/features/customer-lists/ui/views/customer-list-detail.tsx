'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Chip, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';

import { EntitiesPage } from '@/shared/blocks/entities-page';
import { formatFlexibleDate } from '@/lib/utils/format-date';
import { TCG_BADGE_LABELS } from '../../domain/constants';
import { useCustomerListDetail } from '../hooks/use-customer-list-detail';
import CustomerListItemsTable from '../components/customer-list-items-table';

interface CustomerListDetailProps {
  listId: string;
}

export default function CustomerListDetail({
  listId,
}: CustomerListDetailProps) {
  const router = useRouter();
  const { list, loading, error } = useCustomerListDetail(listId);

  const handleBack = useCallback(() => {
    router.push('/listas-clientes');
  }, [router]);

  const backButton = (
    <Button
      variant='light'
      startContent={<Icon icon='lucide:arrow-left' />}
      onPress={handleBack}
      className='text-accent'
    >
      Volver
    </Button>
  );

  if (loading && !list) {
    return (
      <EntitiesPage>
        <EntitiesPage.Toolbar label='Detalle de lista'>
          {backButton}
        </EntitiesPage.Toolbar>
        <EntitiesPage.CardContainer>
          <div className='text-default-400 flex flex-col items-center justify-center py-16'>
            <Icon icon='lucide:loader' className='animate-spin text-5xl' />
          </div>
        </EntitiesPage.CardContainer>
      </EntitiesPage>
    );
  }

  if (error || !list) {
    return (
      <EntitiesPage>
        <EntitiesPage.Toolbar label='Detalle de lista'>
          {backButton}
        </EntitiesPage.Toolbar>
        <EntitiesPage.CardContainer>
          <div className='text-default-400 flex flex-col items-center justify-center py-16'>
            <Icon icon='lucide:list-x' className='text-5xl' />
            <p className='mt-4 text-lg font-medium'>
              {error ? 'Error al cargar la lista' : 'Lista no encontrada'}
            </p>
          </div>
        </EntitiesPage.CardContainer>
      </EntitiesPage>
    );
  }

  return (
    <EntitiesPage>
      <EntitiesPage.Toolbar label={`Lista: ${list.name}`}>
        {backButton}
      </EntitiesPage.Toolbar>

      <EntitiesPage.CardContainer>
        <div className='flex flex-col gap-6 px-4'>
          <div className='bg-default-50 flex flex-col gap-4 rounded-xl p-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div className='flex min-w-0 flex-col gap-1'>
                <h2 className='text-xl font-bold'>{list.name}</h2>
                <div className='flex items-center gap-2'>
                  <Icon
                    icon='lucide:user'
                    className='text-default-400 text-sm'
                  />
                  <button
                    type='button'
                    onClick={() =>
                      router.push(`/clientes/${list.customer.guid}`)
                    }
                    className='text-accent text-sm hover:underline'
                  >
                    {list.customer.name || list.customer.emailAddress}
                  </button>
                </div>
                <div className='flex items-center gap-2'>
                  <Icon
                    icon='lucide:mail'
                    className='text-default-400 text-sm'
                  />
                  <span className='text-default-600 text-sm'>
                    {list.customer.emailAddress}
                  </span>
                </div>
              </div>

              <Chip size='sm' variant='flat' color='secondary'>
                {TCG_BADGE_LABELS[list.tcg] ?? list.tcg}
              </Chip>
            </div>

            <Divider />

            <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-default-400 text-[10px] tracking-wide uppercase'>
                  Cartas
                </span>
                <span className='text-sm font-semibold'>{list.itemCount}</span>
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-default-400 text-[10px] tracking-wide uppercase'>
                  Creada
                </span>
                <span className='text-sm font-semibold'>
                  {formatFlexibleDate(list.createdDate)}
                </span>
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-default-400 text-[10px] tracking-wide uppercase'>
                  Actualizada
                </span>
                <span className='text-sm font-semibold'>
                  {formatFlexibleDate(list.updatedDate)}
                </span>
              </div>
            </div>
          </div>

          <CustomerListItemsTable items={list.items} loading={loading} />
        </div>
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
}
