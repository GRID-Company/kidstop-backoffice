'use client';

import { Control } from 'react-hook-form';
import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { PasswordConfirmationForm } from '@/shared/schemas/password-confirmation.schema';
import PasswordForm from './password-form';

interface PasswordFormLayoutProps {
  title: string;
  description: string;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  loading: boolean;
  buttonText: string;
  control: Control<PasswordConfirmationForm>;
  otpGuid: string | null;
  invalidLinkMessage: string;
}

export const PasswordFormLayout = ({
  title,
  description,
  onSubmit,
  loading,
  buttonText,
  control,
  otpGuid,
  invalidLinkMessage,
}: PasswordFormLayoutProps) => {
  const header = (
    <div className='mb-8 flex w-full items-center gap-2'>
      <Link href='/login' className='text-foreground'>
        <Icon icon='mdi:arrow-left' className='text-2xl' />
      </Link>
      <h1 className='text-xl font-bold'>{title}</h1>
    </div>
  );

  if (!otpGuid) {
    return (
      <>
        {header}
        <p className='text-sm text-gray-500'>{invalidLinkMessage}</p>
      </>
    );
  }

  return (
    <>
      {header}

      <p className='mb-8 text-sm text-gray-500'>{description}</p>

      <form className='flex w-full flex-col gap-6' onSubmit={onSubmit}>
        <PasswordForm<PasswordConfirmationForm>
          label='Nueva contraseña'
          placeholder=''
          isDisabled={loading}
          hasTooltip
          tooltipType='criteria'
          controlProps={{ control, name: 'password' }}
        />

        <PasswordForm<PasswordConfirmationForm>
          label='Confirmar contraseña'
          placeholder=''
          isDisabled={loading}
          hasTooltip
          tooltipType='match'
          controlProps={{ control, name: 'confirmPassword' }}
        />

        <Button
          className='w-full'
          type='submit'
          isLoading={loading}
          isDisabled={loading}
          color='primary'
        >
          {buttonText}
        </Button>
      </form>
    </>
  );
};
