import { CardLanguage } from '@/lib/api/schema-types';
import { ICardSearchResponse, TCGGame } from '../../domain/types';

const pokemonResponse: ICardSearchResponse = {
  resolvedByAI: true,
  bestMatch: {
    guid: 'mock-pokemon-1',
    game: 'pokemon',
    name: 'Pikachu',
    setName: 'Scarlet & Violet',
    setCode: 'SVI',
    collectorNumber: '025',
    imageUrl: null,
    language: CardLanguage.English,
    isFoil: false,
    variant: 'Normal',
    sellPrice: 45.0,
    referencePrice: 45.0,
    totalStock: 3,
    availableStock: true,
    isBestMatch: true,
  },
  candidates: [
    {
      guid: 'mock-pokemon-1',
      game: 'pokemon',
      name: 'Pikachu',
      setName: 'Scarlet & Violet',
      setCode: 'SVI',
      collectorNumber: '025',
      imageUrl: null,
      language: CardLanguage.English,
      isFoil: false,
      variant: 'Normal',
      sellPrice: 45.0,
      referencePrice: 45.0,
      totalStock: 3,
      availableStock: true,
      isBestMatch: true,
    },
    {
      guid: 'mock-pokemon-2',
      game: 'pokemon',
      name: 'Charizard ex',
      setName: 'Obsidian Flames',
      setCode: 'OBF',
      collectorNumber: '125',
      imageUrl: null,
      language: CardLanguage.English,
      isFoil: false,
      variant: 'Double Rare',
      sellPrice: 320.0,
      referencePrice: 320.0,
      totalStock: 0,
      availableStock: false,
      isBestMatch: false,
    },
  ],
  aiResolved: {
    name: 'Pikachu',
    nameEs: 'Pikachu',
    cardNumber: '025',
    setCode: 'SVI',
    setName: 'Scarlet & Violet',
    setNameEs: 'Escarlata y Púrpura',
    cardText: null,
    cardTextEs: null,
    detectedLanguage: 'en',
  },
  error: null,
};

const magicResponse: ICardSearchResponse = {
  resolvedByAI: false,
  bestMatch: {
    guid: 'mock-magic-1',
    game: 'magic',
    name: 'Lightning Bolt',
    setName: 'Masters 25',
    setCode: null,
    collectorNumber: '141',
    imageUrl: null,
    language: CardLanguage.English,
    isFoil: false,
    variant: null,
    sellPrice: 120.0,
    referencePrice: 120.0,
    totalStock: 5,
    availableStock: true,
    isBestMatch: true,
  },
  candidates: [
    {
      guid: 'mock-magic-1',
      game: 'magic',
      name: 'Lightning Bolt',
      setName: 'Masters 25',
      setCode: null,
      collectorNumber: '141',
      imageUrl: null,
      language: CardLanguage.English,
      isFoil: false,
      variant: null,
      sellPrice: 120.0,
      referencePrice: 120.0,
      totalStock: 5,
      availableStock: true,
      isBestMatch: true,
    },
    {
      guid: 'mock-magic-2',
      game: 'magic',
      name: 'The One Ring',
      setName: 'The Lord of the Rings',
      setCode: null,
      collectorNumber: '0246',
      imageUrl: null,
      language: CardLanguage.English,
      isFoil: true,
      variant: null,
      sellPrice: 2500.0,
      referencePrice: 2500.0,
      totalStock: 1,
      availableStock: true,
      isBestMatch: false,
    },
  ],
  aiResolved: null,
  error: null,
};

const magicAiResolved: ICardSearchResponse['aiResolved'] = {
  name: 'Lightning Bolt',
  nameEs: 'Relámpago',
  cardNumber: '141',
  setCode: 'A25',
  setName: 'Masters 25',
  setNameEs: 'Masters 25',
  cardText: null,
  cardTextEs: null,
  detectedLanguage: 'en',
};

export const mockCardSearchResponse = (
  game: TCGGame,
  aiSearchOnly = false
): ICardSearchResponse => {
  const response = game === 'magic' ? magicResponse : pokemonResponse;

  if (!aiSearchOnly) {
    return response;
  }

  return {
    ...response,
    resolvedByAI: true,
    bestMatch: null,
    candidates: [],
    aiResolved: response.aiResolved ?? magicAiResolved,
  };
};
