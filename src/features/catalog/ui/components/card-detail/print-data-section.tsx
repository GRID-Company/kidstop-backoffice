'use client';

export interface PrintField {
  label: string;
  value: string | null;
}

interface PrintDataSectionProps {
  title?: string;
  fields: PrintField[];
}

export default function PrintDataSection({
  title = 'Datos de la impresión',
  fields,
}: PrintDataSectionProps) {
  const visible = fields.filter((f) => f.value != null && f.value !== '');
  if (visible.length === 0) return null;

  return (
    <div
      className='border-default-200 rounded-xl border bg-white p-4'
      data-testid='print-data-section'
    >
      <h5 className='text-default-500 mb-3 text-xs font-semibold tracking-wide uppercase'>
        {title}
      </h5>
      <div className='grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3'>
        {visible.map((field) => (
          <div key={field.label} className='flex flex-col gap-0.5'>
            <span className='text-default-400 text-[10px] tracking-wide uppercase'>
              {field.label}
            </span>
            <span className='text-default-800 text-sm font-medium'>
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
