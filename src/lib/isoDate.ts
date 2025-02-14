
export function isoDate(date?: Date, time = false) {
  const options = time ? {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  } as const
    : { year: 'numeric', month: '2-digit', day: '2-digit' } as const;
  /* '' not 'de-DE' to get iso formatted */
  return new Intl.DateTimeFormat('sv', options).format(date);
}
