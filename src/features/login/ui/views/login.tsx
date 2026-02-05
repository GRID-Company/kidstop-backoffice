'use client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLoginForm } from '../../adapters/use-login-form';
import { useProcessLogin } from '@/lib/auth/use-process-login';
import LoginFormBody from '../components/login-form-body';
import { LoginForm } from '../../adapters/login-form.schema';
import { useMutation } from '@apollo/client/react';
import { LoginDocument } from '@/lib/api/generated/login.generated';
import { LoginOutput } from '@/lib/api/schema-types';
import toast from 'react-hot-toast';
import { ERROR_MESSAGES } from '@/lib/consts/error-messages';

export default function LoginPage() {
  const { processLogin } = useProcessLogin();
  const { control, handleSubmit } = useLoginForm();
  const [mutate, { loading }] = useMutation(LoginDocument);

  const onLogin: SubmitHandler<LoginForm> = async (payload): Promise<void> => {
    try {
      const { data } = await mutate({ variables: { loginUserInput: payload } });
      processLogin(data?.login as LoginOutput);
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : ERROR_MESSAGES.LOGIN_GENERIC_ERROR
      );
    }
  };

  return (
    <form
      className='flex w-full flex-col items-center justify-center gap-24 lg:gap-16'
      onSubmit={(...args) => {
        void handleSubmit(onLogin)(...args);
      }}
    >
      <LoginFormBody control={control} loading={loading} />
    </form>
  );
}
