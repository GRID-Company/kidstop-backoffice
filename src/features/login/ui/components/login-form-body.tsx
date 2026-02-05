import { Control, FieldValues } from 'react-hook-form';
import { Button, Link } from '@heroui/react';
import { LoginForm } from '../../adapters/login-form.schema';
import InputForm from '@/shared/base/form-controls/input-form';
import PasswordForm from '@/shared/base/form-controls/password-form';

interface LoginFormProps {
  loading?: boolean;
  control: Control<LoginForm>;
}

export default function LoginFormBody({
  loading = false,
  control,
}: LoginFormProps) {
  return (
    <div className='block w-full'>
      <InputForm<LoginForm>
        label='Correo electrónico'
        placeholder='Ingresa tu correo electrónico'
        isDisabled={loading}
        className='mb-6'
        controlProps={{
          control,
          name: 'emailAddress',
        }}
      />

      <PasswordForm<LoginForm>
        label='Contraseña *'
        placeholder='Contraseña'
        isDisabled={loading}
        controlProps={{
          control,
          name: 'password',
        }}
      />

      <Button
        className='mt-24 w-full'
        type='submit'
        isLoading={loading}
        disabled={loading}
        color='primary'
      >
        Iniciar sesión
      </Button>

      <div className='mt-6 flex w-full justify-center'>
        <Link href='/recuperar-contrasena' color='primary' underline='hover'>
          Olvidé mi contraseña
        </Link>
      </div>
    </div>
  );
}
