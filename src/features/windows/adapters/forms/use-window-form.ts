import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { WindowForm, windowFormSchema } from './window.form.schema';
import {
  DefaultChape,
  DefaultProfile,
  WindowCategoryType,
  WindowComplexity,
  WindowType,
} from '../../domain/windows.domain';

export function useWindowForm(defaults?: Partial<WindowForm>) {
  return useForm<WindowForm>({
    resolver: zodResolver(windowFormSchema),
    defaultValues: {
      name: '',
      categoryType: WindowCategoryType.ANGULOS_TEES_Y_SOLERA,
      windowComplexity: WindowComplexity.SIMPLE,
      subWindows: [
        {
          projectionQuantity: 0,
          windowType: WindowType.FIJA,
        },
      ],
      horizontalProfiles: [DefaultProfile],
      verticalProfiles: [DefaultProfile],
      chapeWindows: [DefaultChape],
      sampleImages: [],
      technicalImage: null,
      hasMosquitoNet: false,
      ...defaults,
    },
    mode: 'onSubmit',
  });
}
