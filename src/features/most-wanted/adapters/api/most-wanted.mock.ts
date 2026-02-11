import { IMostWantedCard, MOST_WANTED_PRIORITIES } from '../../domain/types';
import { MOCK_CARDS } from '@/features/catalog/adapters/api/catalog.mock';
import { TCG_TYPES } from '@/lib/types/tcg.types';

const pokemonCards = MOCK_CARDS.filter((c) => c.tcgType === TCG_TYPES.POKEMON);
const magicCards = MOCK_CARDS.filter((c) => c.tcgType === TCG_TYPES.MAGIC);

export const MOCK_MOST_WANTED: IMostWantedCard[] = [
  {
    id: 'mw-001',
    card: pokemonCards[0],
    tcgType: TCG_TYPES.POKEMON,
    priority: MOST_WANTED_PRIORITIES.HIGH,
    notes: 'Clientes preguntan seguido por esta carta',
    isActive: true,
    order: 1,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'mw-002',
    card: pokemonCards[3],
    tcgType: TCG_TYPES.POKEMON,
    priority: MOST_WANTED_PRIORITIES.HIGH,
    notes: '',
    isActive: true,
    order: 2,
    createdAt: '2025-01-16T10:00:00Z',
    updatedAt: '2025-01-16T10:00:00Z',
  },
  {
    id: 'mw-003',
    card: pokemonCards[1],
    tcgType: TCG_TYPES.POKEMON,
    priority: MOST_WANTED_PRIORITIES.MEDIUM,
    notes: 'Buena demanda en torneos',
    isActive: true,
    order: 3,
    createdAt: '2025-01-17T10:00:00Z',
    updatedAt: '2025-01-17T10:00:00Z',
  },
  {
    id: 'mw-004',
    card: pokemonCards[4],
    tcgType: TCG_TYPES.POKEMON,
    priority: MOST_WANTED_PRIORITIES.LOW,
    notes: '',
    isActive: false,
    order: 4,
    createdAt: '2025-01-18T10:00:00Z',
    updatedAt: '2025-01-18T10:00:00Z',
  },
  {
    id: 'mw-005',
    card: magicCards[0],
    tcgType: TCG_TYPES.MAGIC,
    priority: MOST_WANTED_PRIORITIES.HIGH,
    notes: 'Staple de formato Modern',
    isActive: true,
    order: 1,
    createdAt: '2025-01-19T10:00:00Z',
    updatedAt: '2025-01-19T10:00:00Z',
  },
  {
    id: 'mw-006',
    card: magicCards[1],
    tcgType: TCG_TYPES.MAGIC,
    priority: MOST_WANTED_PRIORITIES.MEDIUM,
    notes: '',
    isActive: true,
    order: 2,
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-01-20T10:00:00Z',
  },
];
