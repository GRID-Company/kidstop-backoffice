'use client';

import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { usePasswordConfirmationForm } from '@/shared/hooks/use-password-confirmation-form';
import { PasswordConfirmationForm } from '@/shared/schemas/password-confirmation.schema';
import { ChangePasswordDocument } from '@/lib/api/generated/password.generated';
import { ERROR_MESSAGES } from '@/lib/consts/error-messages';
import { PasswordFormLayout } from '@/shared/base/form-controls/password-form-layout';

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpGuid = searchParams.get('id');

  const { control, handleSubmit } = usePasswordConfirmationForm();
  const [mutate, { loading }] = useMutation(ChangePasswordDocument);

  const onSubmit: SubmitHandler<PasswordConfirmationForm> = async (payload) => {
    if (!otpGuid) return;

    try {
      await mutate({
        variables: {
          changePasswordInput: {
            new_password: payload.password,
            otp_guid: otpGuid,
          },
        },
      });
      toast.success('Contraseña cambiada exitosamente');
      router.push('/login');
    } catch {
      toast.error(ERROR_MESSAGES.CHANGE_PASSWORD_ERROR);
    }
  };

  return (
    <PasswordFormLayout
      title='Cambiar contraseña'
      description='Ingresa tu nueva contraseña.'
      onSubmit={(...args) => handleSubmit(onSubmit)(...args)}
      loading={loading}
      buttonText='Guardar'
      control={control}
      otpGuid={otpGuid}
      invalidLinkMessage={ERROR_MESSAGES.CHANGE_PASSWORD_INVALID_LINK}
    />
  );
}
