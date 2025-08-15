import React from 'react';
import { Calendar, DateObject } from 'react-native-calendars';
import dayjs from 'dayjs';
import { YMD } from '../../utils/dateUtils';

type Props = {
  selectedDate: string;
  onSelectDate: (ymd: string) => void;
};

export default function CalendarMonthView({
  selectedDate,
  onSelectDate,
}: Props) {
  return (
    <Calendar
      current={dayjs().format(YMD)}
      markedDates={{ [selectedDate]: { selected: true } }}
      onDayPress={(d: DateObject) => onSelectDate(d.dateString)}
    />
  );
}
