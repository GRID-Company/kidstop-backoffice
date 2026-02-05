interface MosquitoNetPillProps {
  hasMosquitoNet: boolean;
  className?: string;
}

export default function MosquitoNetPill({
  hasMosquitoNet,
  className,
}: MosquitoNetPillProps) {
  const bg = hasMosquitoNet ? '#CCE7FF' : '#DEE3E7';

  return (
    <div
      className={`py-.5 rounded-full border border-gray-400 px-2 text-xs font-semibold uppercase shadow-md ${className}`}
      style={{ backgroundColor: bg }}
    >
      {hasMosquitoNet ? 'Con mosquitero' : 'Sin mosquitero'}
    </div>
  );
}
