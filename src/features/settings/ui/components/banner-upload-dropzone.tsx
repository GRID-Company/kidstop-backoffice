import { useState, useCallback, useEffect } from 'react';
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

  const tcgLabel = tcg === 'pokemon' ? 'Pokémon' : 'Magic';
  const tcgIcon = tcg === 'pokemon' ? 'game-icons:pokeball' : 'game-icons:magic-swirl';
  const tcgType = tcg === 'pokemon' ? 'POKEMON' : 'MAGIC';

  const { data: bannerData, loading: bannerLoading, refetch: refetchBanner } = useQuery(GetBannerDocument, {
    variables: { tcg: tcgType as any },
    skip: !currentBannerGuid,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (currentBannerGuid) {
      refetchBanner();
    }
  }, [currentBannerGuid, refetchBanner]);

  useEffect(() => {
    if (!isLoading && selectedFile) {
      setSelectedFile(null);
      onClear?.();
    }
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <Card className="border-2 border-dashed border-default-300">
      <CardBody className="gap-4 p-6">
        <div className="flex items-center gap-2">
          <Icon icon={tcgIcon} width={24} height={24} />
          <h4 className="text-lg font-semibold">{tcgLabel}</h4>
          {currentBannerGuid && (
            <span className="ml-auto text-xs text-success">✓ Configurado</span>
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
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            disabled={isLoading}
            className="absolute inset-0 cursor-pointer opacity-0"
          />

          <div className="flex flex-col items-center justify-center gap-2 py-8 px-4">
            {isLoading ? (
              <>
                <Spinner size="lg" color="primary" />
                <p className="text-sm text-default-500">Subiendo archivo...</p>
              </>
            ) : (
              <>
                <Icon icon="lucide:cloud-upload" width={32} height={32} className="text-default-400" />
                <p className="text-center text-sm font-medium">
                  Arrastra tu archivo aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-default-400">JPG, PNG o WebP (máx. 5MB)</p>
              </>
            )}
          </div>
        </div>

        {selectedFile && (
          <div className="flex items-center justify-between rounded-lg bg-default-100 p-3">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:file-image" width={20} height={20} className="text-default-500" />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-default-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              onClick={handleClear}
              disabled={isLoading}
            >
              <Icon icon="lucide:x" width={18} height={18} />
            </Button>
          </div>
        )}

        {currentBannerGuid && currentBanner && !selectedFile && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-default-500">Banner actual</p>
            {bannerLoading ? (
              <div className="flex items-center justify-center rounded-lg bg-default-100 py-8">
                <Spinner size="sm" />
              </div>
            ) : (
              <Image
                src={currentBanner.path}
                alt={`${tcgLabel} banner`}
                className="rounded-lg object-cover"
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
