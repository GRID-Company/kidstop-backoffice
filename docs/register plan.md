# Receta Replicable: Flujos de Autenticación Existentes

Receta basada en los 3 flujos de autenticación ya implementados en el proyecto, documentando patrones exactos para replicar en nuevos proyectos.

## Análisis de los 3 Flujos Existentes

### Patrón de Rutas App Router
```typescript
// Estructura consistente en /app/(not-authenticated)/
src/app/(not-authenticated)/
├── login/page.tsx
├── recuperar-contrasena/page.tsx  
├── cambiar-contrasena/page.tsx
└── registro/page.tsx

// Patrón exacto de cada page.tsx:
'use client';
import [FeaturePage] from '@/features/login/ui/views/[feature]';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`[Título] ${TITLE_SUFFIX}`);
  return <[FeaturePage] />;
}
```

### Patrón de Vistas en Features
```typescript
// Estructura en /features/login/ui/views/
├── login.tsx              // Usa loginFormSchema + LoginDocument
├── reset-password.tsx     // Usa resetPasswordFormSchema + RequestPasswordChangeDocument  
├── change-password.tsx    // Usa passwordConfirmationSchema + ChangePasswordDocument
└── register.tsx           // Usa passwordConfirmationSchema + UserFinishSignUpDocument
```

### Tipos GraphQL Reales del Proyecto
```typescript
// Inputs exactos del backend
LoginUserInput: { emailAddress: string; password: string }
RequestPasswordChangeInput: { emailAddress: string }
ChangePasswordInput: { new_password: string; otp_guid: string }
UserFinishSignupInput: { otp_guid: string; password: string }

// Outputs exactos del backend
LoginOutput: { access_token?: string; credentials_expired_token?: string; user?: User }
RequestPasswordChangeOutput: { success: boolean }
ChangePasswordOutput: { success: boolean }
```

## Receta de los 3 Flujos Implementados

### 1. Flujo de Login (EXISTENTE)

#### Schema Zod
```typescript
// src/features/login/adapters/login-form.schema.ts
import { z } from 'zod';

export const loginFormSchema = z.object({
  emailAddress: z
    .string()
    .min(1, 'El correo es obligatorio')
    .check(z.email({ error: 'El formato del correo no es válido' })),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export type LoginForm = z.infer<typeof loginFormSchema>;
```

#### Hook del Formulario
```typescript
// src/features/login/adapters/use-login-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginForm, loginFormSchema } from './login-form.schema';

export function useLoginForm(defaults?: Partial<LoginForm>) {
  return useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailAddress: '',
      password: '',
      ...defaults,
    },
    mode: 'all',
  });
}
```

#### Vista del Login
```typescript
// src/features/login/ui/views/login.tsx
'use client';
import { SubmitHandler } from 'react-hook-form';
import { useLoginForm } from '../../adapters/use-login-form';
import { useProcessLogin } from '@/lib/auth/use-process-login';
import LoginFormBody from '../components/login-form-body';
import { LoginForm } from '../../adapters/login-form.schema';
import { useMutation } from '@apollo/client/react';
import { LoginDocument } from '@/lib/api/generated/login.generated';
import { LoginOutput } from '@/lib/api/schema-types';
import { showToast } from '@/shared/base/toast/show-toast';
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
      showToast.error(
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
```

### 2. Flujo de Reset Password (EXISTENTE)

#### Schema Zod
```typescript
// src/features/login/adapters/reset-password-form.schema.ts
import { z } from 'zod';

export const resetPasswordFormSchema = z.object({
  emailAddress: z
    .string()
    .min(1, 'El correo es obligatorio')
    .check(z.email({ error: 'El formato del correo no es válido' })),
});

export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;
```

#### Vista Reset Password (Patrón Completo)
```typescript
// src/features/login/ui/views/reset-password.tsx
'use client';

import { SubmitHandler } from 'react-hook-form';
import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useMutation } from '@apollo/client/react';
import { useResetPasswordForm } from '../../adapters/use-reset-password-form';
import { ResetPasswordForm } from '../../adapters/reset-password-form.schema';
import { RequestPasswordChangeDocument } from '@/lib/api/generated/password.generated';
import { showToast } from '@/shared/base/toast/show-toast';
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
      showToast.success('El correo se envió correctamente');
      countdown.start();
    } catch {
      showToast.error(ERROR_MESSAGES.RESET_PASSWORD_ERROR);
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
```

### 3. Flujo de Change Password y Register (EXISTENTE)

#### Schema Compartido
```typescript
// src/shared/schemas/password-confirmation.schema.ts
import { z } from 'zod';
import { SHARED_VALIDATION_MESSAGES } from '@/lib/consts/validation-messages';

export const passwordConfirmationSchema = z
  .object({
    password: z.string().min(1, SHARED_VALIDATION_MESSAGES.REQUIRED_PASSWORD),
    confirmPassword: z.string().min(1, SHARED_VALIDATION_MESSAGES.REQUIRED_CONFIRM_PASSWORD),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: SHARED_VALIDATION_MESSAGES.PASSWORDS_MUST_MATCH,
    path: ['confirmPassword'],
  });

export type PasswordConfirmationForm = z.infer<typeof passwordConfirmationSchema>;
```

#### Hook Compartido
```typescript
// src/shared/hooks/use-password-confirmation-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  PasswordConfirmationForm,
  passwordConfirmationSchema,
} from '../schemas/password-confirmation.schema';

export function usePasswordConfirmationForm(defaults?: Partial<PasswordConfirmationForm>) {
  return useForm<PasswordConfirmationForm>({
    resolver: zodResolver(passwordConfirmationSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
      ...defaults,
    },
    mode: 'all',
  });
}
```

#### Componente Layout Compartido
```typescript
// src/shared/components/password-form-layout.tsx
'use client';

import { Control } from 'react-hook-form';
import { Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { PasswordConfirmationForm } from '../schemas/password-confirmation.schema';
import PasswordForm from '../base/form-controls/password-form';

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

export default function PasswordFormLayout({
  title,
  description,
  onSubmit,
  loading,
  buttonText,
  control,
  otpGuid,
  invalidLinkMessage,
}: PasswordFormLayoutProps) {
  if (!otpGuid) {
    return (
      <>
        <div className='mb-8 flex w-full items-center gap-2'>
          <Link href='/login' className='text-foreground'>
            <Icon icon='mdi:arrow-left' className='text-2xl' />
          </Link>
          <h1 className='text-xl font-bold'>{title}</h1>
        </div>
        <p className='text-sm text-gray-500'>{invalidLinkMessage}</p>
      </>
    );
  }

  return (
    <>
      <div className='mb-8 flex w-full items-center gap-2'>
        <Link href='/login' className='text-foreground'>
          <Icon icon='mdi:arrow-left' className='text-2xl' />
        </Link>
        <h1 className='text-xl font-bold'>{title}</h1>
      </div>

      <p className='mb-8 text-sm text-gray-500'>{description}</p>

      <form className='flex w-full flex-col gap-6' onSubmit={onSubmit}>
        <PasswordForm<PasswordConfirmationForm>
          label='Nueva contraseña'
          placeholder='••••••••'
          isDisabled={loading}
          hasTooltip
          tooltipType='criteria'
          controlProps={{ control, name: 'password' }}
        />

        <PasswordForm<PasswordConfirmationForm>
          label='Confirmar contraseña'
          placeholder='••••••••'
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
}
```

#### Vista Change Password
```typescript
// src/features/login/ui/views/change-password.tsx
'use client';

import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePasswordConfirmationForm } from '@/shared/hooks/use-password-confirmation-form';
import { PasswordConfirmationForm } from '@/shared/schemas/password-confirmation.schema';
import { ChangePasswordDocument } from '@/lib/api/generated/password.generated';
import { showToast } from '@/shared/base/toast/show-toast';
import { ERROR_MESSAGES } from '@/lib/consts/error-messages';
import PasswordFormLayout from '@/shared/components/password-form-layout';

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpGuid = searchParams.get('id');

  const { control, handleSubmit } = usePasswordConfirmationForm();
  const [mutate, { loading }] = useMutation(ChangePasswordDocument);

  const onSubmit: SubmitHandler<PasswordConfirmationForm> = async (payload) => {
    if (!otpGuid) {
      showToast.error(ERROR_MESSAGES.CHANGE_PASSWORD_INVALID_LINK);
      return;
    }

    try {
      await mutate({
        variables: {
          changePasswordInput: {
            new_password: payload.password,
            otp_guid: otpGuid,
          },
        },
      });
      showToast.success('Contraseña cambiada exitosamente');
      router.push('/login');
    } catch {
      showToast.error(ERROR_MESSAGES.CHANGE_PASSWORD_ERROR);
    }
  };

  return (
    <PasswordFormLayout
      title="Cambiar contraseña"
      description="Ingresa tu nueva contraseña."
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      buttonText="Enviar"
      control={control}
      otpGuid={otpGuid}
      invalidLinkMessage={ERROR_MESSAGES.CHANGE_PASSWORD_INVALID_LINK}
    />
  );
}
```

#### Vista Register
```typescript
// src/features/login/ui/views/register.tsx
'use client';

import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePasswordConfirmationForm } from '@/shared/hooks/use-password-confirmation-form';
import { PasswordConfirmationForm } from '@/shared/schemas/password-confirmation.schema';
import { UserFinishSignUpDocument } from '@/lib/api/generated/signup.generated';
import { showToast } from '@/shared/base/toast/show-toast';
import { ERROR_MESSAGES } from '@/lib/consts/error-messages';
import PasswordFormLayout from '@/shared/components/password-form-layout';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const otpGuid = searchParams.get('id');

  const { control, handleSubmit } = usePasswordConfirmationForm();
  const [mutate, { loading }] = useMutation(UserFinishSignUpDocument);

  const onSubmit: SubmitHandler<PasswordConfirmationForm> = async (payload) => {
    if (!otpGuid) {
      showToast.error(ERROR_MESSAGES.REGISTER_INVALID_LINK);
      return;
    }

    try {
      await mutate({
        variables: {
          userFinishSignupInput: {
            password: payload.password,
            otp_guid: otpGuid,
          },
        },
      });
      showToast.success('Contraseña creada exitosamente');
      router.push('/login');
    } catch {
      showToast.error(ERROR_MESSAGES.REGISTER_ERROR);
    }
  };

  return (
    <PasswordFormLayout
      title="Crear contraseña"
      description="Crea tu contraseña para acceder al sistema."
      onSubmit={handleSubmit(onSubmit)}
      loading={loading}
      buttonText="Crear contraseña"
      control={control}
      otpGuid={otpGuid}
      invalidLinkMessage={ERROR_MESSAGES.REGISTER_INVALID_LINK}
    />
  );
}
```

## Estructura de Archivos Real del Proyecto

```
src/features/login/
├── adapters/
│   ├── login-form.schema.ts (✅ EXISTENTE)
│   ├── use-login-form.ts (✅ EXISTENTE)
│   ├── reset-password-form.schema.ts (✅ EXISTENTE)
│   ├── use-reset-password-form.ts (✅ EXISTENTE)
│   ├── change-password-form.schema.ts (✅ EXISTENTE)
│   └── use-change-password-form.ts (✅ EXISTENTE)
├── ui/
│   ├── components/
│   │   └── login-form-body.tsx (✅ EXISTENTE)
│   ├── hooks/
│   │   └── use-countdown.ts (✅ EXISTENTE)
│   └── views/
│       ├── login.tsx (✅ EXISTENTE)
│       ├── reset-password.tsx (✅ EXISTENTE)
│       ├── change-password.tsx (✅ EXISTENTE)
│       └── register.tsx (✅ EXISTENTE)

src/lib/api/
├── graphql/
│   ├── login.gql (✅ EXISTENTE)
│   ├── password.gql (✅ EXISTENTE)
│   └── signup.gql (✅ EXISTENTE)
└── generated/
    ├── login.generated.ts (✅ EXISTENTE)
    ├── password.generated.ts (✅ EXISTENTE)
    └── signup.generated.ts (✅ EXISTENTE)

src/app/(not-authenticated)/
├── layout.tsx (✅ EXISTENTE)
├── login/page.tsx (✅ EXISTENTE)
├── recuperar-contrasena/page.tsx (✅ EXISTENTE)
├── cambiar-contrasena/page.tsx (✅ EXISTENTE)
└── registro/page.tsx (✅ EXISTENTE)

src/shared/
├── schemas/
│   └── password-confirmation.schema.ts (✅ EXISTENTE)
├── hooks/
│   └── use-password-confirmation-form.ts (✅ EXISTENTE)
├── components/
│   └── password-form-layout.tsx (✅ EXISTENTE)
└── layouts/
    └── not-authenticated.tsx (✅ EXISTENTE)

src/lib/consts/
├── error-messages.ts (✅ EXISTENTE)
├── validation-messages.ts (✅ EXISTENTE)
└── title-suffix.ts (✅ EXISTENTE)
```

## Patrones Identificados para Replicar

### 1. **Patrón de Page.tsx en App Router**
```typescript
// Estructura exacta para cada ruta
'use client';
import [FeaturePage] from '@/features/login/ui/views/[feature]';
import { TITLE_SUFFIX } from '@/lib/consts/title-suffix';
import { useTitle } from 'react-use';

export default function Page() {
  useTitle(`[Título específico] ${TITLE_SUFFIX}`);
  return <[FeaturePage] />;
}
```

### 2. **Patrón de Vista con Apollo**
```typescript
// Estructura común en todas las vistas
'use client';
import { SubmitHandler } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { useRouter, useSearchParams } from 'next/navigation'; // Si necesita params
import { use[Feature]Form } from '../../adapters/use-[feature]-form';
import { [Feature]Form } from '../../adapters/[feature]-form.schema';
import { [Feature]Document } from '@/lib/api/generated/[feature].generated';
import { showToast } from '@/shared/base/toast/show-toast';
import { ERROR_MESSAGES } from '@/lib/consts/error-messages';

export default function [Feature]Page() {
  const { control, handleSubmit } = use[Feature]Form();
  const [mutate, { loading }] = useMutation([Feature]Document);
  
  const onSubmit: SubmitHandler<[Feature]Form> = async (payload) => {
    try {
      await mutate({ variables: { [inputName]: payload } });
      showToast.success('[Mensaje de éxito]');
      // Redirección si aplica
    } catch {
      showToast.error(ERROR_MESSAGES.[ERROR_KEY]);
    }
  };

  return (
    // JSX del formulario
  );
}
```

### 3. **Patrón de Schema + Hook**
```typescript
// Schema Zod
import { z } from 'zod';
export const [feature]FormSchema = z.object({
  // campos con validación
});
export type [Feature]Form = z.infer<typeof [feature]FormSchema>;

// Hook correspondiente
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
export function use[Feature]Form(defaults?: Partial<[Feature]Form>) {
  return useForm<[Feature]Form>({
    resolver: zodResolver([feature]FormSchema),
    defaultValues: { /* valores por defecto */ },
    mode: 'all',
  });
}
```

### 4. **Patrón de Reutilización**
- **Schemas compartidos**: `passwordConfirmationSchema` usado por `change-password` y `register`
- **Hooks compartidos**: `usePasswordConfirmationForm` reutilizado
- **Componentes compartidos**: `PasswordFormLayout` para formularios similares
- **Constantes centralizadas**: `ERROR_MESSAGES`, `VALIDATION_MESSAGES`, `TITLE_SUFFIX`

## Comandos para Replicar

```bash
# 1. Generar tipos desde GraphQL (si hay nuevas mutations)
npm run codegen

# 2. Estructura de carpetas a crear para nuevo flujo
mkdir -p src/features/[feature]/adapters
mkdir -p src/features/[feature]/ui/views
mkdir -p src/app/(not-authenticated)/[ruta]

# 3. Archivos base a crear
touch src/features/[feature]/adapters/[feature]-form.schema.ts
touch src/features/[feature]/adapters/use-[feature]-form.ts
touch src/features/[feature]/ui/views/[feature].tsx
touch src/app/(not-authenticated)/[ruta]/page.tsx
```

Esta receta documenta exactamente los 3 flujos implementados y los patrones para replicar en nuevos proyectos con la misma arquitectura.
