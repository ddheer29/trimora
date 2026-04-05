import React from 'react';
import { Calendar, DateObject } from 'react-native-calendars';
import dayjs from 'dayjs';
import { YMD } from '../../utils/dateUtils';
import theme from '../../utils/Theme';

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
      markedDates={{
        [selectedDate]: {
          selected: true,
          selectedColor: theme.colors.primaryDark,
          selectedTextColor: theme.colors.textOnPrimary,
        },
      }}
      onDayPress={(d: DateObject) => onSelectDate(d.dateString)}
      theme={{
        // Backgrounds
        // calendarBackground: theme.colors.background,
        // backgroundColor: theme.colors.background,

        // Text colors
        textSectionTitleColor: theme.colors.primaryDark,
        textSectionTitleDisabledColor: theme.colors.textDisabled,
        dayTextColor: theme.colors.textPrimary,
        selectedDayTextColor: theme.colors.textOnPrimary,
        monthTextColor: theme.colors.primaryDark,
        todayTextColor: theme.colors.highlight,
        textDisabledColor: theme.colors.textDisabled,

        // Selection colors
        selectedDayBackgroundColor: theme.colors.primaryDark,
        dotColor: theme.colors.highlight,
        selectedDotColor: theme.colors.textOnPrimary,
        todayDotColor: theme.colors.highlight,

        // Arrows
        arrowColor: theme.colors.primaryDark,
        disabledArrowColor: theme.colors.textDisabled,
        arrowStyle: { paddingHorizontal: 4 },

        // Fonts
        textDayFontFamily: theme.fonts.body,
        textMonthFontFamily: theme.fonts.heading,
        textDayHeaderFontFamily: theme.fonts.subheading,

        textDayFontFamily: theme.fonts.regular,
        textMonthFontFamily: theme.fonts.bold,
        textDayHeaderFontFamily: theme.fonts.semiBold,

        textDayFontSize: theme.fontSizes.md,
        textMonthFontSize: theme.fontSizes.xl,
        textDayHeaderFontSize: theme.fontSizes.sm,

        // Extra styling
        todayBackgroundColor: theme.colors.card,
        agendaTodayColor: theme.colors.primaryDark,
        agendaKnobColor: theme.colors.primaryDark,
      }}
      style={{
        borderRadius: theme.borderRadius.lg,
        marginVertical: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        ...theme.shadows.soft,
      }}
    />
  );
}
