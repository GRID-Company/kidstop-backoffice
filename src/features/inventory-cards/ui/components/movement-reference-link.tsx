'use client';

import NextLink from 'next/link';
import { MOVEMENT_TYPES } from '../../domain/constants';
import { getMovementReferenceHref } from '../../domain/inventory.domain';

interface MovementReferenceLinkProps {
  movementType: string;
  reference?: string | null;
  className?: string;
}

export default function MovementReferenceLink({
  movementType,
  reference,
  className,
}: MovementReferenceLinkProps) {
  const href = getMovementReferenceHref(movementType, reference);

  if (!href) {
    return (
      <span className={`text-default-500 ${className ?? ''}`}>
        {reference ?? '—'}
      </span>
    );
  }

  const ariaLabel =
    movementType === MOVEMENT_TYPES.PURCHASE_ENTRY
      ? `Ver compra ${reference}`
      : `Ver venta ${reference}`;

  return (
    <NextLink
      href={href}
      aria-label={ariaLabel}
      className={`text-accent hover:underline ${className ?? ''}`}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
    >
      {reference}
    </NextLink>
  );
}
