import { WindowForm } from '@/features/windows/adapters/forms/window.form.schema';
import { WindowComplexity } from '@/features/windows/domain/windows.domain';
import { createContext, useContext } from 'react';
import { useWatch, type Control } from 'react-hook-form';

export type WindowFormContextType = {
  control: Control<WindowForm>;
  isWindowSimple?: boolean;
};

const WindowFormCtx = createContext<WindowFormContextType | null>(null);

export const useWindowFormCtx = () => {
  const ctx = useContext(WindowFormCtx);
  if (!ctx)
    throw new Error('useWindowForm must be used within <WindowForm.Root>');

  const windowComplexity = useWatch({
    control: ctx.control,
    name: 'windowComplexity',
  });
  const isWindowSimple = windowComplexity === WindowComplexity.SIMPLE;

  return {
    ...ctx,
    isWindowSimple,
  };
};

export const WindowFormProvider = WindowFormCtx.Provider;
