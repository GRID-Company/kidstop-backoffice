import { useState, useCallback, useEffect, useRef } from 'react';
import { Button, Card, CardBody, Spinner, Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useQuery } from '@apollo/client/react';
import { GetBannerDocument } from '@/lib/api/generated/files.generated';

interface BannerUploadDropzoneProps {
  tcg: 'pokemon' | 'magic';
  currentBannerGuid?: string;
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
  onClear?: () => void;
}

export const BannerUploadDropzone = ({
  tcg,
  currentBannerGuid,
  onFileSelect,
  isLoading = false,
  onClear,
}: BannerUploadDropzoneProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const prevLoadingRef = useRef(isLoading);

  const tcgLabel = tcg === 'pokemon' ? 'Pokémon' : 'Magic';
  const tcgIcon =
    tcg === 'pokemon' ? 'game-icons:pokeball' : 'game-icons:magic-swirl';
  const tcgType = tcg === 'pokemon' ? 'POKEMON' : 'MAGIC';

  const {
    data: bannerData,
    loading: bannerLoading,
    refetch: refetchBanner,
  } = useQuery(GetBannerDocument, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: { tcg: tcgType as any }, // GraphQL enum compatibility
    skip: !currentBannerGuid,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (currentBannerGuid) {
      refetchBanner();
    }
  }, [currentBannerGuid, refetchBanner]);

  useEffect(() => {
    if (prevLoadingRef.current && !isLoading && selectedFile) {
      setSelectedFile(null);
      onClear?.();
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading, selectedFile, onClear]);

  const currentBanner = bannerData?.getBanner;

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        const file = files[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        const file = files[0];
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleClear = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <Card className='border-default-300 border-2 border-dashed'>
      <CardBody className='gap-4 p-6'>
        <div className='flex items-center gap-2'>
          <Icon icon={tcgIcon} width={24} height={24} />
          <h4 className='text-lg font-semibold'>{tcgLabel}</h4>
          {currentBannerGuid && (
            <span className='text-success ml-auto text-xs'>✓ Configurado</span>
          )}
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed transition-colors ${
            dragActive
              ? 'border-primary bg-primary-50'
              : 'border-default-300 bg-default-50'
          }`}
        >
          <input
            type='file'
            accept='image/jpeg,image/png,image/webp'
            onChange={handleFileInput}
            disabled={isLoading}
            className='absolute inset-0 cursor-pointer opacity-0'
          />

          <div className='flex flex-col items-center justify-center gap-2 px-4 py-8'>
            {isLoading ? (
              <>
                <Spinner size='lg' color='primary' />
                <p className='text-default-500 text-sm'>Subiendo archivo...</p>
              </>
            ) : (
              <>
                <Icon
                  icon='lucide:cloud-upload'
                  width={32}
                  height={32}
                  className='text-default-400'
                />
                <p className='text-center text-sm font-medium'>
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <p className='text-default-400 text-xs'>
                  JPG, PNG o WebP (máx. 5MB)
                </p>
              </>
            )}
          </div>
        </div>

        {selectedFile && (
          <div className='bg-default-100 flex items-center justify-between rounded-lg p-3'>
            <div className='flex items-center gap-2'>
              <Icon
                icon='lucide:file-image'
                width={20}
                height={20}
                className='text-default-500'
              />
              <div className='flex flex-col'>
                <p className='text-sm font-medium'>{selectedFile.name}</p>
                <p className='text-default-500 text-xs'>
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              isIconOnly
              variant='light'
              size='sm'
              onClick={handleClear}
              disabled={isLoading}
            >
              <Icon icon='lucide:x' width={18} height={18} />
            </Button>
          </div>
        )}

        {currentBannerGuid && currentBanner && !selectedFile && (
          <div className='flex flex-col gap-2'>
            <p className='text-default-500 text-xs font-medium'>
              Banner actual
            </p>
            {bannerLoading ? (
              <div className='bg-default-100 flex items-center justify-center rounded-lg py-8'>
                <Spinner size='sm' />
              </div>
            ) : (
              <Image
                src={currentBanner.path}
                alt={`${tcgLabel} banner`}
                className='rounded-lg object-cover'
                width={400}
                height={150}
              />
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
