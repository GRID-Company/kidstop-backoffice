import { WindowForm } from '@/features/windows/adapters/forms/window.form.schema';
import { FileCategory, FileType } from '@/lib/types/file.types';
import KidstopButton from '@/shared/base/heorui-overrides/button';
import KidstopCard from '@/shared/base/heorui-overrides/card';
import UploadImageButton from '@/shared/blocks/files/upload-file';
import { CardBody, Image } from '@heroui/react';
import { UseFormSetValue, useWatch } from 'react-hook-form';
import { useWindowFormCtx } from './window-form.context';
import CloseButton from '@/shared/base/buttons/close-button';

interface WindowImagesProps {
  setValue: UseFormSetValue<WindowForm>;
}

export default function WindowImages({ setValue }: WindowImagesProps) {
  const { control } = useWindowFormCtx();

  const technicalImage = useWatch({
    control,
    name: 'technicalImage',
  });
  const sampleImages = useWatch({
    control,
    name: 'sampleImages',
  });

  const handleUploadImage = (
    controlName: keyof WindowForm,
    file: FileType | undefined
  ) => {
    if (!file) return;
    if (controlName === 'technicalImage') return setValue(controlName, file);

    setValue(controlName, [...sampleImages, file]);
  };

  const onRemoveTechnicalImage = () => {
    setValue('technicalImage', null);
  };

  const onRemoveSampleImage = (index: number) => {
    setValue(
      'sampleImages',
      sampleImages.filter((_: unknown, i: number) => i !== index)
    );
  };

  return (
    <KidstopCard>
      <CardBody className='p-4'>
        <div className=''>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-lg'>Imágen técnica</p>
              <p className='text-content-tertiary text-xs'>
                Agrega el dibujo técnico
              </p>
            </div>
            <UploadImageButton
              inputId='technical-img'
              category={FileCategory.TECHNICAL_IMAGE}
              onUpload={(file) => handleUploadImage('technicalImage', file)}
            />
          </div>

          <div className='my-6 min-h-[80px]'>
            {technicalImage && (
              <div className='relative h-[80px] w-fit min-w-[80px]'>
                <Image
                  alt='Imágen técnica'
                  src={technicalImage.path}
                  width={300}
                  className='aspect-auto h-[80px] w-auto'
                />
                <CloseButton
                  onPress={onRemoveTechnicalImage}
                  className='absolute -top-2 -right-2 z-10'
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-lg'>Imágenes de muestra</p>
              <p className='text-content-tertiary text-xs'>
                Agrega hasta 2 imagenes
              </p>
            </div>
            <UploadImageButton
              inputId='samples-img'
              category={FileCategory.SAMPLE_IMAGE}
              onUpload={(file) => handleUploadImage('sampleImages', file)}
              isDisabled={sampleImages.length === 2}
            />
          </div>

          <div className='my-6 flex min-h-[80px] gap-4'>
            {sampleImages?.map((sampleImage: FileType, index: number) => (
              <div
                className='relative h-[80px] w-fit min-w-[80px]'
                key={sampleImage.guid}
              >
                <Image
                  alt='Imágen técnica'
                  src={sampleImage.path}
                  width={300}
                  className='aspect-auto h-[80px] w-auto'
                />
                <CloseButton
                  onPress={() => onRemoveSampleImage(index)}
                  className='absolute -top-2 -right-2 z-10'
                />
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </KidstopCard>
  );
}
