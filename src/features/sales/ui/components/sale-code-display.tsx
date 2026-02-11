'use client';

import { useState } from 'react';
import { Snippet } from '@heroui/react';

import { SaleCode } from '../../domain/types';

interface SaleCodeDisplayProps {
  code: SaleCode;
  className?: string;
}

export default function SaleCodeDisplay({ code, className }: SaleCodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Snippet
      symbol=""
      variant="flat"
      color={copied ? 'success' : 'default'}
      size="sm"
      onCopy={handleCopy}
      className={className}
      classNames={{
        pre: 'font-mono font-semibold tracking-wider',
      }}
    >
      {code}
    </Snippet>
  );
}
