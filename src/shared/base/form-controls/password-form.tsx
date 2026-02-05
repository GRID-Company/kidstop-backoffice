import { Controller, FieldValues } from 'react-hook-form';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { InputProps, Tooltip } from '@heroui/react';
import { ControlWithFormProps } from '@/lib/types/controller.types';
import OverrideInput from '../heorui-overrides/input';

interface PasswordFormProps<T extends FieldValues> extends Partial<InputProps> {
  controlProps: ControlWithFormProps<T>;
  hasTooltip?: boolean;
  tooltipType?: 'criteria' | 'match';
}

export default function PasswordForm<T extends FieldValues>({
  controlProps,
  hasTooltip = false,
  tooltipType = 'criteria',
  ...inputProps
}: PasswordFormProps<T>) {
  const [isVisible, setIsVisible] = useState(false);
  const [touched, setTouched] = useState(false);

  return (
    <Controller
      {...controlProps}
      render={({ field: { onBlur, ...field }, fieldState: { invalid } }) => (
        <div className='w-full'>
          <OverrideInput
            type={isVisible ? 'text' : 'password'}
            isInvalid={invalid}
            onFocus={() => {
              setTouched(true);
              onBlur();
            }}
            onBlur={() => {
              setTouched(false);
            }}
            {...inputProps}
            {...field}
            endContent={
              <button
                className='focus:outline-none'
                type='button'
                onClick={() => {
                  setIsVisible(!isVisible);
                }}
              >
                {isVisible ? (
                  <Icon
                    icon='mdi:eye-off'
                    className='text-primary pointer-events-none text-2xl'
                  />
                ) : (
                  <Icon
                    icon='mdi:eye'
                    className='text-primary pointer-events-none text-2xl'
                  />
                )}
              </button>
            }
          />

          <Tooltip
            isOpen={touched && invalid && hasTooltip}
            placement='bottom-start'
            shadow='lg'
            content={
              <>
                {tooltipType === 'criteria' && (
                  <div className='p-2'>
                    <p className='mb-2 text-xs font-bold'>
                      La contraseña debe cumplir con <br /> los siguientes
                      criterios:
                    </p>
                    <ul className='ml-4 list-disc text-xs'>
                      <li
                        className={
                          field.value?.match(/(?=.*\d).*$/) !== null
                            ? 'font-semibold text-green-700'
                            : ''
                        }
                      >
                        Un número
                      </li>
                      <li
                        className={
                          field.value?.match(/(?=.*[A-Z]).*$/) !== null
                            ? 'font-semibold text-green-700'
                            : ''
                        }
                      >
                        Una letra mayúscula
                      </li>
                      <li
                        className={
                          field.value?.match(/(?=.*[a-z]).*$/) !== null
                            ? 'font-semibold text-green-700'
                            : ''
                        }
                      >
                        Una letra minúsula
                      </li>
                      <li
                        className={
                          field.value?.match(/.{8,}$/) !== null
                            ? 'font-semibold text-green-700'
                            : ''
                        }
                      >
                        Mínimo 8 carácteres
                      </li>
                    </ul>
                  </div>
                )}

                {tooltipType === 'match' && (
                  <div className='p-2'>
                    <p className='text-xs font-bold'>
                      Las contraseñas no coinciden.
                    </p>
                  </div>
                )}
              </>
            }
          >
            <div className='w-full'></div>
          </Tooltip>
        </div>
      )}
    />
  );
}
