export type FileType = {
  guid: string;
  name: string;
  path: string;
  category?: string;
};

export enum FileCategory {
  TECHNICAL_IMAGE = 'TECHNICAL_IMAGE',
  SAMPLE_IMAGE = 'SAMPLE_IMAGE',
}
