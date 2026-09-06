import {
  ICameraConfig,
  ICardDimensions,
  ICardRegionConfig,
  IDetectionParams,
  INormalizedRegion,
} from './types';

export const NORMALIZED_CARD_DIMENSIONS: ICardDimensions = {
  width: 744,
  height: 1039,
} as const;

export const DISPLAY_CARD_DIMENSIONS: ICardDimensions = {
  width: 350,
  height: 490,
} as const;

export const CARD_DIMENSIONS = DISPLAY_CARD_DIMENSIONS;

export const OPENCV_CDN = 'https://docs.opencv.org/5.0/opencv.js' as const;

export const CAMERA_CONFIG: ICameraConfig = {
  facingMode: 'environment',
  width: { ideal: 1280 },
  height: { ideal: 720 },
} as const;

export const DETECTION_PARAMS: IDetectionParams = {
  bkgThresh: 60,
  minAreaRatio: 0.01,
  maxAreaRatio: 0.9,
  approxEpsilon: 0.02,
  minAspectRatioPortrait: 0.55,
  maxAspectRatioPortrait: 0.85,
  minAspectRatioLandscape: 1.18,
  maxAspectRatioLandscape: 1.82,
} as const;

export const TESSERACT_LANG = 'eng' as const;

export const POKEMON_DEFAULT_REGIONS: INormalizedRegion[] = [
  {
    id: 'name',
    x: 0.04,
    y: 0.02,
    width: 0.68,
    height: 0.1,
  },
  {
    id: 'hp',
    x: 0.7,
    y: 0.02,
    width: 0.26,
    height: 0.1,
  },
  {
    id: 'footer',
    x: 0.02,
    y: 0.82,
    width: 0.96,
    height: 0.16,
  },
  {
    id: 'setSymbol',
    x: 0.02,
    y: 0.82,
    width: 0.15,
    height: 0.16,
  },
];

export const MAGIC_DEFAULT_REGIONS: INormalizedRegion[] = [
  {
    id: 'name',
    x: 0.04,
    y: 0.02,
    width: 0.7,
    height: 0.08,
  },
  {
    id: 'manaCost',
    x: 0.75,
    y: 0.02,
    width: 0.21,
    height: 0.08,
  },
  {
    id: 'typeLine',
    x: 0.04,
    y: 0.55,
    width: 0.92,
    height: 0.06,
  },
  {
    id: 'footerLeft',
    x: 0.02,
    y: 0.92,
    width: 0.4,
    height: 0.06,
  },
  {
    id: 'footerRight',
    x: 0.6,
    y: 0.92,
    width: 0.38,
    height: 0.06,
  },
  {
    id: 'setSymbol',
    x: 0.85,
    y: 0.52,
    width: 0.12,
    height: 0.12,
  },
];

export const CARD_REGION_CONFIGS: Record<string, ICardRegionConfig> = {
  'pokemon-default': {
    game: 'pokemon',
    layout: 'pokemon-default',
    regions: POKEMON_DEFAULT_REGIONS,
  },
  'magic-default': {
    game: 'magic',
    layout: 'magic-default',
    regions: MAGIC_DEFAULT_REGIONS,
  },
};

export const COMPOSITE_IMAGE_CONFIG = {
  regionScale: 2,
  regionSpacing: 40,
  backgroundColor: [255, 255, 255],
} as const;

export const EXTRACTION_WEIGHTS = {
  pokemon: {
    collectorNumber: 0.35,
    name: 0.35,
    setCode: 0.15,
    hp: 0.075,
    rarity: 0.075,
  },
  magic: {
    collectorNumber: 0.4,
    name: 0.3,
    setCode: 0.15,
    rarity: 0.15,
  },
} as const;

export const SCANNER_CONFIG = {
  DETECTION_THROTTLE_MS: 100,
  MIN_STABLE_FRAMES: 2,
  MAX_PROCESSING_TIME_MS: 30000,
  OCR_TIMEOUT_MS: 15000,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY_MS: 1000,
} as const;

export const PERFORMANCE_THRESHOLDS = {
  FAST_DETECTION_MS: 50,
  ACCEPTABLE_DETECTION_MS: 100,
  SLOW_DETECTION_MS: 200,
  FAST_OCR_MS: 1000,
  ACCEPTABLE_OCR_MS: 3000,
  SLOW_OCR_MS: 5000,
} as const;

export const ERROR_MESSAGES = {
  CAMERA_NOT_AVAILABLE: 'Cámara no disponible. Verifica los permisos.',
  OPENCV_NOT_LOADED: 'OpenCV no está cargado. Recarga la página.',
  NO_CARD_DETECTED: 'No se detectó ninguna carta. Intenta de nuevo.',
  CAPTURE_QUALITY_LOW:
    'Calidad de captura insuficiente. Mejora la iluminación.',
  OCR_QUALITY_LOW: 'Texto no legible. Asegúrate de que la carta esté enfocada.',
  OCR_TIMEOUT: 'Tiempo de espera agotado. Intenta de nuevo.',
  PROCESSING_ERROR: 'Error al procesar la carta. Intenta de nuevo.',
  NETWORK_ERROR: 'Error de red. Verifica tu conexión.',
  VALIDATION_ERROR: 'Datos inválidos. Revisa los campos.',
} as const;

export const HAPTIC_PATTERNS = {
  SUCCESS: 200,
  ERROR: [100, 50, 100],
  WARNING: 50,
  STOP: 0,
} as const;

export const TORCH_CONFIG = {
  SUPPORTED_FACING_MODES: ['environment'] as const,
  CLEANUP_DELAY_MS: 100,
} as const;

export const QUALITY_THRESHOLDS = {
  MINIMUM_CAPTURE: 0.25,
  MINIMUM_OCR: 0.08,
  MINIMUM_EXTRACTION: 0.05,
  MINIMUM_OVERALL: 0.15,
  GOOD_CAPTURE: 0.6,
  GOOD_OCR: 0.7,
  GOOD_EXTRACTION: 0.5,
  EXCELLENT_CAPTURE: 0.8,
  EXCELLENT_OCR: 0.85,
  EXCELLENT_EXTRACTION: 0.7,
} as const;
