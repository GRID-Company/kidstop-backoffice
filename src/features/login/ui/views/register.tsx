'use client';

import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { usePasswordConfirmationForm } from '@/shared/hooks/use-password-confirmation-form';
import { PasswordConfirmationForm } from '@/shared/schemas/password-confirmation.schema';
import { UserFinishSignUpDocument } from '@/lib/api/generated/signup.generated';
import { ERROR_MESSAGES } from '@/lib/consts/error-messages';
import { PasswordFormLayout } from '@/shared/base/form-controls/password-form-layout';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpGuid = searchParams.get('id');

  const { control, handleSubmit } = usePasswordConfirmationForm();
  const [mutate, { loading }] = useMutation(UserFinishSignUpDocument);

  const onSubmit: SubmitHandler<PasswordConfirmationForm> = async (payload) => {
    if (!otpGuid) return;

    try {
      await mutate({
        variables: {
          userFinishSignupInput: {
            password: payload.password,
            otp_guid: otpGuid,
          },
        },
      });
      toast.success('Contraseña creada exitosamente');
      router.push('/login');
    } catch {
      toast.error(ERROR_MESSAGES.REGISTER_ERROR);
    }
  };

  return (
    <PasswordFormLayout
      title='Crear contraseña'
      description='Crea tu contraseña para acceder al sistema.'
      onSubmit={(...args) => handleSubmit(onSubmit)(...args)}
      loading={loading}
      buttonText='Crear contraseña'
      control={control}
      otpGuid={otpGuid}
      invalidLinkMessage={ERROR_MESSAGES.REGISTER_INVALID_LINK}
    />
  );
}
