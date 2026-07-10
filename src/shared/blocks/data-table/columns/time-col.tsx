export default function TimeCol({ date }: { date: string | number }) {
  const _parsedDate = new Date(date);
  return (
    <span>
      {date !== null
        ? new Date(date).toLocaleTimeString('en-GB', {
            hour: 'numeric',
            minute: 'numeric',
          })
        : '-'}
    </span>
  );
}
