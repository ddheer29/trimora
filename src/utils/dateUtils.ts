import dayjs from 'dayjs';

export const YMD = 'YYYY-MM-DD';
export const HMMA = 'h:mm A';

export const toYMD = (d: string | Date) => dayjs(d).format(YMD);

export const overlapsHour = (
  startIso: string,
  endIso: string,
  hour24: number,
) => {
  const start = dayjs(startIso);
  const end = dayjs(endIso);
  const hStart = start.startOf('hour');
  const hEnd = hStart.add(1, 'hour');
  return start.isBefore(hEnd) && end.isAfter(hStart);
};
