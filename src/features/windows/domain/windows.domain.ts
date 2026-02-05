import {
  QuerySelectChapesArgs,
  QuerySelectGlassesArgs,
  QuerySelectProfilesArgs,
  SelectProfilesArgs,
} from '@/lib/api/schema-types';

export const DefaultProfile = {
  inventoryItemSKU: '',
  quantity: 0,
  size: 0,
  subWindow: '0',
};

export const DefaultChape = {
  chapeInventoryItemGuid: '',
  quantity: 0,
  subWindow: '0',
};

export const WindowTypeOptions = [
  {
    value: 'ABATIBLE',
    label: 'Abatible',
  },
  {
    value: 'CORREDIZA',
    label: 'Corrediza',
  },
  {
    value: 'FIJA',
    label: 'Fija',
  },
  {
    value: 'OSCILOBATIENTE',
    label: 'Oscilobatiente',
  },
  {
    value: 'PIVOTANTE',
    label: 'Pivoteante',
  },
  {
    value: 'PLEGADIZA',
    label: 'Plegadiza',
  },
  {
    value: 'PROYECCION',
    label: 'Proyección',
  },
  {
    value: 'TELESCOPICA',
    label: 'Telescopio',
  },
];

export enum WindowType {
  ABATIBLE = 'ABATIBLE',
  CORREDIZA = 'CORREDIZA',
  FIJA = 'FIJA',
  OSCILOBATIENTE = 'OSCILOBATIENTE',
  PIVOTANTE = 'PIVOTANTE',
  PLEGADIZA = 'PLEGADIZA',
  PROYECCION = 'PROYECCION',
  TELESCOPICA = 'TELESCOPICA',
}

export enum WindowTypeLabel {
  ABATIBLE = 'Abatible',
  CORREDIZA = 'Corrediza',
  FIJA = 'Fija',
  OSCILOBATIENTE = 'Oscilobatiente',
  PIVOTANTE = 'Pivoteante',
  PLEGADIZA = 'Plegadiza',
  PROYECCION = 'Proyección',
  TELESCOPICA = 'Telescopio',
}

export enum WindowCategoryType {
  ANGULOS_TEES_Y_SOLERA = 'ANGULOS_TEES_Y_SOLERA',
  BANOS = 'BANOS',
  CUADRICULA = 'CUADRICULA',
  DUELAS_Y_BOLSAS = 'DUELAS_Y_BOLSAS',
  FINESTRA = 'FINESTRA',
  FISARMONICA = 'FISARMONICA',
  GRIGLIAS = 'GRIGLIAS',
  MOSQUITERO_COLGANTE = 'MOSQUITERO_COLGANTE',
  MOSQUITERO_UNIVERSAL = 'MOSQUITERO_UNIVERSAL',
}

export const MosquitoNetOptions = [
  {
    value: 'WITH',
    label: 'Con mosquitero',
  },
  {
    value: 'WITHOUT',
    label: 'Sin mosquitero',
  },
];

export enum WindowComplexity {
  SIMPLE = 'SIMPLE',
  COMPLEX = 'COMPLEX',
}

export const ProfilesQueryDefaultVariables: QuerySelectProfilesArgs = {
  selectProfilesArgs: {
    limit: 50,
    skip: 0,
    sort: {
      column: 'name',
      order: 'ASC',
    },
  },
};

export const GlassesQueryDefaultVariables: QuerySelectGlassesArgs = {
  selectGlassesArgs: {
    limit: 50,
    skip: 0,
    sort: {
      column: 'name',
      order: 'ASC',
    },
  },
};

export const ChapesQueryDefaultVariables: QuerySelectChapesArgs = {
  selectChapesArgs: {
    limit: 50,
    skip: 0,
    sort: {
      column: 'name',
      order: 'ASC',
    },
  },
};
