import { UploadFileDocument } from '@/lib/api/generated/files.generated';
import { ERROR_MESSAGES } from '@/lib/consts/error-messages';
import { FileCategory, FileType } from '@/lib/types/file.types';
import CanalviButton from '@/shared/base/heorui-overrides/button';
import { useMutation } from '@apollo/client/react';
import toast from 'react-hot-toast';

export interface UploadImageProps {
  inputId: string;
  category: FileCategory;
  onUpload: (file: FileType | undefined) => void;
  isDisabled?: boolean;
}

export default function UploadImageButton({
  inputId,
  category,
  onUpload,
  isDisabled,
}: UploadImageProps) {
  const [mutate, { loading }] = useMutation(UploadFileDocument);

  const handleButtonClick = () => {
    const fileInput = document.getElementById(inputId);
    if (fileInput !== null) {
      fileInput.click();
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data } = await mutate({
        variables: {
          uploadFileArgs: {
            category,
            file,
            name: file?.name ?? `${category}-${new Date().getTime()}`,
          },
        },
      });

      onUpload(data?.uploadFile);
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : ERROR_MESSAGES.ERROR_UPLOAD_FILE
      );
    }
  };

  return (
    <>
      <input
        id={inputId}
        type='file'
        onChange={handleFileSelect}
        className='hidden'
        accept='image/*'
      />

      <CanalviButton
        size='sm'
        variant='bordered'
        isLoading={loading}
        isDisabled={loading || isDisabled}
        onPress={handleButtonClick}
      >
        Seleccionar
      </CanalviButton>
    </>
  );
}
