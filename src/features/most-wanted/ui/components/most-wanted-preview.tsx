'use client';

import Image from 'next/image';
import { Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

import { TCGType } from '@/lib/types/tcg.types';
import { TCG_OPTIONS } from '@/lib/consts/tcg-options';
import logoImg from '@/assets/img/logo.png';
import { IMostWantedCard } from '../../domain/types';
import { MOST_WANTED_PRIORITY_LABELS } from '../../domain/constants';

interface MostWantedPreviewProps {
  items: IMostWantedCard[];
  selectedTCG: TCGType;
}

const PARCHMENT = {
  bg: 'linear-gradient(180deg, #d4b896 0%, #c9ad82 10%, #d4b896 30%, #c4a67a 60%, #d4b896 80%, #b89460 100%)',
  cardBg: 'linear-gradient(135deg, #f5e6c8 0%, #ecdbb5 40%, #e4cea3 100%)',
  rankBg: 'linear-gradient(180deg, #dbb45c 0%, #b8922e 100%)',
  vignette: 'inset 0 0 80px rgba(80,40,10,0.25), inset 0 0 160px rgba(80,40,10,0.1)',
  ctaBg: 'linear-gradient(180deg, rgba(139,90,43,0.05) 0%, rgba(139,90,43,0.18) 100%)',
} as const;

const NOISE_TEXTURE_URI = `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const PRIORITY_BADGE: Record<string, { bg: string; text: string; border: string; glow?: string }> = {
  HIGH: { bg: 'bg-red-800', text: 'text-white', border: 'border-red-900/30', glow: 'animate-[pulse-glow_2s_ease-in-out_infinite]' },
  MEDIUM: { bg: 'bg-amber-700', text: 'text-white', border: 'border-amber-800/30' },
  LOW: { bg: 'bg-stone-500', text: 'text-white', border: 'border-stone-600/30' },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.5, ease: [0, 0, 0.2, 1] as const },
  }),
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
};

function OrnamentalDivider() {
  return (
    <div className="flex items-center gap-3 px-8 py-1">
      <div className="h-px flex-1 bg-amber-900/20" />
      <Icon icon="lucide:diamond" width={10} className="text-amber-800/40" />
      <Icon icon="lucide:diamond" width={14} className="text-amber-800/50" />
      <Icon icon="lucide:diamond" width={10} className="text-amber-800/40" />
      <div className="h-px flex-1 bg-amber-900/20" />
    </div>
  );
}

function PreviewCardItem({
  item,
  rank,
  index,
}: {
  item: IMostWantedCard;
  rank: number;
  index: number;
}) {
  const badge = PRIORITY_BADGE[item.priority] ?? PRIORITY_BADGE.LOW;
  const cardData = item.pokemonCardSummary || item.magicCardSummary;
  const cardName = cardData?.name || 'Unknown';
  const cardImage = cardData?.imageUri || null;
  const cardSet = item.pokemonCardSummary?.setName || item.magicCardSummary?.edition || '';
  const cardNumber = item.pokemonCardSummary?.cardNumber || item.magicCardSummary?.collectorNumber || '';

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-5 rounded-xl border border-amber-900/20 px-5 py-4"
      style={{
        background: PARCHMENT.cardBg,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 3px 8px rgba(0,0,0,0.12)',
      }}
    >
      <span
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg text-3xl font-black text-amber-950"
        style={{
          background: PARCHMENT.rankBg,
          textShadow: '0 1px 0 rgba(255,255,255,0.4)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        {rank}
      </span>

      <motion.div
        className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg border-2 border-amber-900/25 bg-amber-100/50 shadow-md"
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 3 + index * 0.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {cardImage ? (
          <img
            src={cardImage}
            alt={cardName}
            className="absolute inset-0 h-full w-full object-contain p-0.5"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-amber-700/40">
            <Icon icon="lucide:image" width={28} />
          </div>
        )}
      </motion.div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-xl font-extrabold text-amber-950">
          {cardName}
        </span>
        <span className="truncate text-base text-amber-800/70">
          {cardSet} {cardNumber ? `— ${cardNumber}` : ''}
        </span>
        {item.notes && (
          <span className="truncate text-sm italic text-amber-700/60">
            {item.notes}
          </span>
        )}
      </div>

      <span
        className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-bold shadow-sm ${badge.bg} ${badge.text} ${badge.border} ${badge.glow ?? ''}`}
      >
        {MOST_WANTED_PRIORITY_LABELS[item.priority]}
      </span>
    </motion.div>
  );
}

function EmptyPreview() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-amber-700/50">
      <Icon icon="lucide:eye-off" width={48} />
      <p className="text-xl font-medium">Sin cartas activas para mostrar</p>
      <p className="text-base">Activa cartas en la lista para verlas en el preview</p>
    </div>
  );
}

export default function MostWantedPreview({ items, selectedTCG }: MostWantedPreviewProps) {
  const activeItems = items.filter((item) => item.active);
  const tcgOption = TCG_OPTIONS.find((o) => o.key === selectedTCG);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-default-200 bg-default-50 p-5">
      <div className="flex items-center gap-2">
        <Icon icon="lucide:eye" width={18} className="text-accent" />
        <span className="text-sm font-semibold text-accent">
          Vista previa pública
        </span>
        <span className="ml-auto text-xs text-default-400">
          {activeItems.length} {activeItems.length === 1 ? 'carta' : 'cartas'}
        </span>
      </div>

      <Divider />

      <div
        className="relative overflow-hidden rounded-2xl border-4 border-amber-950"
        style={{
          background: PARCHMENT.bg,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            boxShadow: PARCHMENT.vignette,
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]"
          style={{
            backgroundImage: NOISE_TEXTURE_URI,
          }}
        />

        <div className="mw-bg-shimmer pointer-events-none absolute inset-0 z-10" />

        <div className="relative z-20 flex flex-col items-center gap-4 px-8 pb-4 pt-10">
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src={logoImg}
              alt="Kidstop"
              width={200}
              height={60}
              className="drop-shadow-lg"
            />
          </motion.div>

          <h2
            className="mw-shimmer-title text-4xl font-black uppercase tracking-[0.2em] text-amber-950"
            style={{ textShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
          >
            Most Wanted
          </h2>

          {tcgOption && (
            <div
              className="flex items-center gap-2.5 rounded-full px-5 py-2 shadow-md"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              <Icon icon={tcgOption.icon} width={22} className="text-white" />
              <span className="text-base font-bold text-white">
                {tcgOption.label}
              </span>
            </div>
          )}
        </div>

        <div className="relative z-20">
          <OrnamentalDivider />
        </div>

        <div className="relative z-20 flex flex-col gap-4 px-6 py-6">
          {activeItems.length === 0 ? (
            <EmptyPreview />
          ) : (
            <AnimatePresence mode="popLayout">
              {activeItems.map((item, index) => (
                <PreviewCardItem key={item.guid} item={item} rank={index + 1} index={index} />
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="relative z-20">
          <OrnamentalDivider />
        </div>

        <div
          className="relative z-20 px-8 py-6 text-center"
          style={{
            background: PARCHMENT.ctaBg,
          }}
        >
          <motion.p
            className="text-xl font-black uppercase tracking-wider text-amber-950"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.12)' }}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
          >
            Trae estas cartas y te las compramos hoy
          </motion.p>
        </div>
      </div>

      <p className="text-center text-[10px] text-default-400">
        Simulación de cómo se verá en la pantalla pública de 55&quot;
      </p>
    </div>
  );
}
