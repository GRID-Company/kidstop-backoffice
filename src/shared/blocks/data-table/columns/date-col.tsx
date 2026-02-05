export default function DateCol({ date }: { date: string | number }) {
  return (
    <span>
      {date !== null
        ? new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })
        : '-'}
    </span>
  );
}
