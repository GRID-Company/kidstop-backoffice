'use client';

import { Pagination, PaginationProps } from '@heroui/react';
import { useSelectedTCGStore } from '@/lib/store/selected-tcg';
import { TCG_THEMES } from '@/lib/consts/tcg-themes';

export const KidstopPagination = (props: Omit<PaginationProps, 'classNames'>) => {
  const selectedTCG = useSelectedTCGStore((state) => state.selectedTCG);

  return (
    <div style={{ '--heroui-primary': TCG_THEMES[selectedTCG].accentHsl } as React.CSSProperties}>
      <Pagination
        {...props}
        color="primary"
        classNames={{
          item: 'bg-white border border-gray-200 text-content-primary',
          cursor: 'text-white',
          prev: 'bg-white border border-gray-200',
          next: 'bg-white border border-gray-200',
        }}
      />
    </div>
  );
};
