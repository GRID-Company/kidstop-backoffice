import type { CardLanguage } from '@/lib/api/schema-types';

export interface IPoint {
  x: number;
  y: number;
}

export interface ICardCorners {
  topLeft: IPoint;
  topRight: IPoint;
  bottomRight: IPoint;
  bottomLeft: IPoint;
}

export interface ICameraConfig {
  facingMode: 'environment' | 'user';
  width: { ideal: number };
  height: { ideal: number };
}

export interface IDetectionParams {
  bkgThresh: number;
  minAreaRatio: number;
  maxAreaRatio: number;
  approxEpsilon: number;
  minAspectRatioPortrait: number;
  maxAspectRatioPortrait: number;
  minAspectRatioLandscape: number;
  maxAspectRatioLandscape: number;
}

export interface IDetectionResult {
  corners: number[];
  found: boolean;
  method: 'contours' | 'roi-fallback' | 'none';
}

export interface ICardDimensions {
  width: number;
  height: number;
}

export interface IGuideRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type OpenCVMat = {
  rows: number;
  cols: number;
  channels: () => number;
  empty: () => boolean;
  clone: () => OpenCVMat;
  delete: () => void;
  roi: (rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => OpenCVMat;
  copyTo: (dst: OpenCVMat) => void;
  convertTo: (
    dst: OpenCVMat,
    rtype: number,
    alpha?: number,
    beta?: number
  ) => void;
  data32S?: Int32Array;
  data32F?: Float32Array;
  data64F?: Float64Array;
  data8U?: Uint8Array;
  isDeleted: () => boolean;
};

export type OpenCV = {
  Mat: {
    new (): OpenCVMat;
    new (
      rows: number,
      cols: number,
      type: number,
      scalar?: { val: number[] }
    ): OpenCVMat;
    ones: (rows: number, cols: number, type: number) => OpenCVMat;
  };
  MatVector: new () => {
    size: () => number;
    get: (i: number) => OpenCVMat;
    delete: () => void;
    push_back: (mat: OpenCVMat) => void;
  };
  Size: new (
    width: number,
    height: number
  ) => { width: number; height: number };
  Rect: new (
    x: number,
    y: number,
    width: number,
    height: number
  ) => { x: number; y: number; width: number; height: number };
  Scalar: {
    new (...values: number[]): { val: number[] };
    all: (value: number) => { val: number[] };
  };

  cvtColor: (src: OpenCVMat, dst: OpenCVMat, code: number) => void;
  findContours: (
    image: OpenCVMat,
    contours: {
      size: () => number;
      get: (i: number) => OpenCVMat;
      delete: () => void;
    },
    hierarchy: OpenCVMat,
    mode: number,
    method: number
  ) => void;
  approxPolyDP: (
    curve: OpenCVMat,
    approxCurve: OpenCVMat,
    epsilon: number,
    closed: boolean
  ) => void;
  contourArea: (contour: OpenCVMat) => number;
  arcLength: (curve: OpenCVMat, closed: boolean) => number;
  boundingRect: (contour: OpenCVMat) => {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  warpPerspective: (
    src: OpenCVMat,
    dst: OpenCVMat,
    M: OpenCVMat,
    dsize: { width: number; height: number },
    flags?: number,
    borderMode?: number,
    borderValue?: { val: number[] }
  ) => void;
  getPerspectiveTransform: (
    srcPoints: OpenCVMat,
    dstPoints: OpenCVMat
  ) => OpenCVMat;
  rotate: (src: OpenCVMat, dst: OpenCVMat, rotateCode: number) => void;
  GaussianBlur: (
    src: OpenCVMat,
    dst: OpenCVMat,
    ksize: { width: number; height: number },
    sigmaX: number,
    sigmaY?: number,
    borderType?: number
  ) => void;
  Canny: (
    image: OpenCVMat,
    edges: OpenCVMat,
    threshold1: number,
    threshold2: number
  ) => void;
  dilate: (
    src: OpenCVMat,
    dst: OpenCVMat,
    kernel: OpenCVMat,
    anchor?: { x: number; y: number },
    iterations?: number
  ) => void;
  morphologyEx: (
    src: OpenCVMat,
    dst: OpenCVMat,
    op: number,
    kernel: OpenCVMat
  ) => void;
  getStructuringElement: (
    shape: number,
    ksize: { width: number; height: number }
  ) => OpenCVMat;
  bilateralFilter: (
    src: OpenCVMat,
    dst: OpenCVMat,
    d: number,
    sigmaColor: number,
    sigmaSpace: number
  ) => void;
  fastNlMeansDenoising: (
    src: OpenCVMat,
    dst: OpenCVMat,
    h: number,
    templateWindowSize: number,
    searchWindowSize: number
  ) => void;
  fastNlMeansDenoisingColored: (
    src: OpenCVMat,
    dst: OpenCVMat,
    h: number,
    hColor: number,
    templateWindowSize: number,
    searchWindowSize: number
  ) => void;
  threshold: (
    src: OpenCVMat,
    dst: OpenCVMat,
    thresh: number,
    maxval: number,
    type: number
  ) => void;
  inRange: (
    src: OpenCVMat,
    lowerb: OpenCVMat,
    upperb: OpenCVMat,
    dst: OpenCVMat
  ) => void;
  bitwise_or: (src1: OpenCVMat, src2: OpenCVMat, dst: OpenCVMat) => void;
  resize: (
    src: OpenCVMat,
    dst: OpenCVMat,
    dsize: { width: number; height: number },
    fx: number,
    fy: number,
    interpolation: number
  ) => void;
  filter2D: (
    src: OpenCVMat,
    dst: OpenCVMat,
    ddepth: number,
    kernel: OpenCVMat
  ) => void;
  Laplacian: (src: OpenCVMat, dst: OpenCVMat, ddepth: number) => void;
  meanStdDev: (src: OpenCVMat, mean: OpenCVMat, stddev: OpenCVMat) => void;
  mean: (src: OpenCVMat) => number[];
  matFromArray: (
    rows: number,
    cols: number,
    type: number,
    array: number[]
  ) => OpenCVMat;
  matFromImageData: (imageData: ImageData) => OpenCVMat;
  imshow: (canvas: HTMLCanvasElement, mat: OpenCVMat) => void;
  rectangle: (
    img: OpenCVMat,
    pt1: { x: number; y: number },
    pt2: { x: number; y: number },
    color: { val: number[] },
    thickness?: number,
    lineType?: number
  ) => void;
  circle: (
    img: OpenCVMat,
    center: { x: number; y: number },
    radius: number,
    color: { val: number[] },
    thickness?: number,
    lineType?: number
  ) => void;
  drawContours: (
    image: OpenCVMat,
    contours: {
      size: () => number;
      get: (i: number) => OpenCVMat;
      delete: () => void;
    },
    contourIdx: number,
    color: { val: number[] },
    thickness?: number,
    lineType?: number
  ) => void;
  getBuildInformation?: () => string;
  onRuntimeInitialized?: () => void;

  COLOR_RGBA2GRAY: number;
  COLOR_RGB2GRAY: number;
  COLOR_RGBA2RGB: number;
  COLOR_RGB2HSV: number;
  COLOR_GRAY2RGB: number;
  RETR_EXTERNAL: number;
  RETR_TREE: number;
  CHAIN_APPROX_SIMPLE: number;
  MORPH_GRADIENT: number;
  MORPH_CLOSE: number;
  MORPH_OPEN: number;
  MORPH_RECT: number;
  ROTATE_90_CLOCKWISE: number;
  ROTATE_180: number;
  ROTATE_90_COUNTERCLOCKWISE: number;
  THRESH_BINARY: number;
  THRESH_OTSU: number;
  CV_8U: number;
  CV_8UC3: number;
  CV_32F: number;
  CV_32FC2: number;
  CV_32SC2: number;
  CV_64F: number;
  INTER_LINEAR: number;
  INTER_CUBIC: number;
  BORDER_DEFAULT: number;
  BORDER_CONSTANT: number;
  LINE_8: number;
};

export type TCGGame = 'pokemon' | 'magic';
export type CardLayout = string;

export interface INormalizedRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ICardRegionConfig {
  game: TCGGame;
  layout: CardLayout;
  regions: INormalizedRegion[];
}

export interface ICompositeRegionMap {
  regionId: string;
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface IOcrToken {
  text: string;
  confidence: number | null;
  centerX: number;
  centerY: number;
  regionId: string | null;
}

export interface IRegionalOcrResult {
  fullText: string;
  regions: Record<
    string,
    {
      text: string;
      tokens: IOcrToken[];
      averageConfidence: number | null;
    }
  >;
}

export interface IExtractedField<T = string> {
  value: T | null;
  normalizedValue: T | null;
  confidence: number;
  sourceRegions: string[];
  rawMatches: string[];
}

export interface IExtractedCardData {
  name: IExtractedField;
  collectorNumber: IExtractedField;
  printedTotal: IExtractedField;
  setCode: IExtractedField;
  setSymbol: IExtractedField;
  hp: IExtractedField<number>;
  rarity: IExtractedField;
  language: IExtractedField;
  printedYear: IExtractedField<number>;
}

export interface IScanConfidence {
  captureQuality: number;
  ocrQuality: number;
  extractionQuality: number;
  overall: number;
}

export interface ICardScanAiResolved {
  name: string | null;
  nameEs: string | null;
  cardNumber: string | null;
  setCode: string | null;
  setName: string | null;
  setNameEs: string | null;
  cardText: string | null;
  cardTextEs: string | null;
  detectedLanguage: string | null;
}

export interface ICardCandidate {
  guid: string;
  game: TCGGame;
  name: string;
  setName: string | null;
  setCode: string | null;
  collectorNumber: string | null;
  imageUrl: string | null;
  language: CardLanguage;
  isFoil: boolean;
  variant: string | null;
  sellPrice: number | null;
  referencePrice: number | null;
  totalStock: number;
  availableStock: boolean;
  isBestMatch: boolean;
}

export interface ICardSearchResponse {
  resolvedByAI: boolean;
  bestMatch: ICardCandidate | null;
  candidates: ICardCandidate[];
  aiResolved: ICardScanAiResolved | null;
  error: string | null;
}

export interface IScannerMetrics {
  contourDetectionMs: number;
  perspectiveTransformMs: number;
  regionExtractionMs: number;
  ocrRequestMs: number;
  parsingMs: number;
  totalMs: number;
}

export type ScannerStatus =
  | 'initializing'
  | 'camera-ready'
  | 'detecting'
  | 'card-stable'
  | 'capturing'
  | 'processing-image'
  | 'extracting-text'
  | 'searching'
  | 'results'
  | 'error';

export interface IScannedCardData {
  imageDataUrl: string;
  normalizedImageUrl: string;
  setIconImageUrl: string | null;
  extractedData: IExtractedCardData;
  confidence: IScanConfidence;
  rawOcr: IRegionalOcrResult;
  detectedAt: Date;
  metrics?: IScannerMetrics;
}

export type HapticPattern = number | number[];

export interface IHapticCapabilities {
  supported: boolean;
  vendor?: 'standard' | 'webkit';
}
