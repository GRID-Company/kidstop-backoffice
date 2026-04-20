import { useState, useCallback } from 'react';
import { Divider } from '@heroui/react';
import toast from 'react-hot-toast';
import KidstopButton from '@/shared/base/heorui-overrides/button';
import { IBannerConfig } from '../../domain/types';
import { bannerSettingsSchema } from '../../adapters/forms/banner-settings.schema';
import SettingsSection from './settings-section';
import { BannerUploadDropzone } from './banner-upload-dropzone';

interface BannerSectionProps {
  banners: IBannerConfig;
  isLoading?: boolean;
  onSave: (pokemonFile?: File, magicFile?: File) => Promise<void>;
}

export default function BannerSection({
  banners,
  isLoading = false,
  onSave,
}: BannerSectionProps) {
  const [pokemonFile, setPokemonFile] = useState<File | null>(null);
  const [magicFile, setMagicFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handlePokemonFileSelect = useCallback((file: File) => {
    try {
      bannerSettingsSchema.parse({ pokemonFile: file });
      setPokemonFile(file);
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || 'Error validando archivo');
    }
  }, []);

  const handleMagicFileSelect = useCallback((file: File) => {
    try {
      bannerSettingsSchema.parse({ magicFile: file });
      setMagicFile(file);
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || 'Error validando archivo');
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!pokemonFile && !magicFile) {
      toast.error('Selecciona al menos un archivo');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(pokemonFile || undefined, magicFile || undefined);
      setPokemonFile(null);
      setMagicFile(null);
    } catch (error) {
      console.error('Error saving banners:', error);
    } finally {
      setIsSaving(false);
    }
  }, [pokemonFile, magicFile, onSave]);

  return (
    <SettingsSection title="Banners de Carpetas Digitales" icon="lucide:image">
      <div className="flex flex-col gap-6">
        <p className="text-sm text-default-500">
          Configura los banners que se mostrarán en las carpetas digitales de Pokémon y Magic.
          Los archivos se subirán al servidor y se asociarán a la configuración global.
        </p>

        <BannerUploadDropzone
          tcg="pokemon"
          currentBannerGuid={banners.pokemon}
          onFileSelect={handlePokemonFileSelect}
          isLoading={isLoading || isSaving}
        />

        <Divider />

        <BannerUploadDropzone
          tcg="magic"
          currentBannerGuid={banners.magic}
          onFileSelect={handleMagicFileSelect}
          isLoading={isLoading || isSaving}
        />

        <Divider />

        <div className="flex justify-end">
          <KidstopButton
            variant="accent"
            onClick={handleSave}
            isLoading={isSaving}
            isDisabled={!pokemonFile && !magicFile}
          >
            Guardar Banners
          </KidstopButton>
        </div>
      </div>
    </SettingsSection>
  );
}
