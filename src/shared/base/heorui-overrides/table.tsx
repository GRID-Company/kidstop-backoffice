import { extendVariants, Table } from '@heroui/react';

export const KidstopTable: any = extendVariants(Table, {
  variants: {
    color: {
      default: {
        base: ['h-full', 'bg-transparent'],
        wrapper: ['p-0', 'bg-transparent', 'rounded-none'],
        thead: ['h-[55px]', 'uppercase', 'rounded-t-lg'],
        th: ['!text-white', '!font-semibold', '!bg-accent'],
        tbody: ['rounded-xl', 'overflow-hidden'],
        tr: [
          'border-b-2',
          'border-[#F5F6F8]',
          'last:border-0',
          'overflow-hidden',
        ],
        td: [
          'bg-white',
          'group-data-[first=true]:first:rounded-tl-lg',
          'group-data-[first=true]:last:rounded-tr-lg',
          'group-data-[last=true]:first:rounded-bl-lg',
          'group-data-[last=true]:last:rounded-br-lg',
          'py-4',
          'data-[selected=true]:before:!bg-[#E4F2FF]',
          'data-[selected=true]:before:!color-black',
          'group-data-[hover=true]:before:!bg-[#E4F2FF]',
          '!opacity-100',
        ],
        sortIcon: ['-mr-4'],
      },
    },
  },
  defaultVariants: {
    color: 'default',
    labelPlacement: 'outside',
    shadow: 'none',
  },
});
