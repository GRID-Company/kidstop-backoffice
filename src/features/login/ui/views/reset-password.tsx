'use client';

import { SubmitHandler } from 'react-hook-form';
import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';
import { useResetPasswordForm } from '../../adapters/use-reset-password-form';
import { ResetPasswordForm } from '../../adapters/reset-password-form.schema';
import { RequestPasswordChangeDocument } from '@/lib/api/generated/password.generated';
import { ERROR_MESSAGES } from '@/lib/consts/error-messages';
import { useCountdown } from '../hooks/use-countdown';
import InputForm from '@/shared/base/form-controls/input-form';

const COUNTDOWN_SECONDS = 90;

export default function ResetPasswordPage() {
  const { control, handleSubmit } = useResetPasswordForm();
  const [mutate, { loading }] = useMutation(RequestPasswordChangeDocument);
  const countdown = useCountdown({ durationSeconds: COUNTDOWN_SECONDS });

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (payload) => {
    try {
      await mutate({
        variables: { requestPasswordChangeInput: payload },
      });
      toast.success('El correo se envió correctamente');
      countdown.start();
    } catch {
      toast.error(ERROR_MESSAGES.RESET_PASSWORD_ERROR);
    }
  };

  const isDisabled = loading || countdown.isActive;

  return (
    <>
      <div className='mb-8 flex w-full items-center gap-2'>
        <Link href='/login' className='text-foreground'>
          <Icon icon='mdi:arrow-left' className='text-2xl' />
        </Link>
        <h1 className='text-xl font-bold'>Restablecer contraseña</h1>
      </div>

      <p className='mb-8 text-sm text-gray-500'>
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer
        tu contraseña.
      </p>

      <form
        className='flex w-full flex-col gap-6'
        onSubmit={(...args) => {
          void handleSubmit(onSubmit)(...args);
        }}
      >
        <InputForm<ResetPasswordForm>
          label='Correo electrónico'
          placeholder='ejemplo@gmail.com'
          isDisabled={isDisabled}
          controlProps={{
            control,
            name: 'emailAddress',
          }}
        />

        <Button
          className='w-full'
          type='submit'
          isLoading={loading}
          isDisabled={isDisabled}
          color='primary'
        >
          {countdown.isActive ? `Reenviar en ${countdown.display}` : 'Enviar'}
        </Button>
      </form>
    </>
  );
}
