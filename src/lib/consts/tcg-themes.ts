import { TCG_TYPES, TCGType } from '../types/tcg.types';

type TCGTheme = {
  sidebarBg: string;
  sidebarActive: string;
  accent: string;
  accentHsl: string;
  pageBg: string;
};

export const TCG_THEMES: Record<TCGType, TCGTheme> = {
  [TCG_TYPES.POKEMON]: {
    sidebarBg: 'linear-gradient(180deg, #e53223 0%, #991b1b 100%)',
    sidebarActive: 'rgba(255, 255, 255, 0.2)',
    accent: '#e53223',
    accentHsl: '5 79% 52%',
    pageBg: '#f5f5f5',
  },
  [TCG_TYPES.MAGIC]: {
    sidebarBg: 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)',
    sidebarActive: '#e85d26',
    accent: '#e85d26',
    accentHsl: '17 81% 53%',
    pageBg: '#f5f5f5',
  },
};

type TCGAlertColors = {
  bg: string;
  border: string;
  icon: string;
  text: string;
};

export const TCG_ALERT_COLORS: Record<TCGType, TCGAlertColors> = {
  [TCG_TYPES.POKEMON]: {
    bg: '#fef2f2',
    border: '#fecaca',
    icon: '#dc2626',
    text: '#991b1b',
  },
  [TCG_TYPES.MAGIC]: {
    bg: '#fff7ed',
    border: '#fed7aa',
    icon: '#ea580c',
    text: '#9a3412',
  },
};
