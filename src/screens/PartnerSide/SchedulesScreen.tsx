import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
import {
  ExpandableCalendar,
  TimelineEventProps,
  TimelineList,
  CalendarProvider,
  TimelineProps,
} from 'react-native-calendars';
import { Ionicons } from '@react-native-vector-icons/ionicons';
// @ts-ignore
import groupBy from 'lodash/groupBy';
import { useNavigation } from '@react-navigation/native';

import { bookingService } from '../../services/bookingService';
import { useUserStore } from '../../store/userStore';
import { TimelineBookingEvent } from '../../types';
import CommonContainer from '@components/CommonContainer';
import theme from '@utils/Theme';

const INITIAL_TIME = { hour: 9, minutes: 0 };

// Utility to get current date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

const SchedulesScreen = () => {
  const navigation = useNavigation<any>();
  const token = useUserStore(state => state.token);

  const [currentDate, setCurrentDate] = useState(getTodayDate());
  const [eventsByDate, setEventsByDate] = useState<{
    [key: string]: (TimelineEventProps & { bookingId: string })[];
  }>({});
  const [loader, setLoader] = useState(false);

  const fetchEvents = async () => {
    if (!token) return;
    try {
      setLoader(true);
      const response = await bookingService.getBookingTimeline();

      if (response.status === 'success') {
        const mappedEvents: (TimelineEventProps & { bookingId: string })[] =
          response.data.map(evt => ({
            id: evt.bookingId,
            start: evt.start,
            end: evt.end,
            title: evt.title,
            summary: evt.summary,
            color: evt.color,
            bookingId: evt.bookingId,
          }));

        const grouped = groupBy(
          mappedEvents,
          (e: any) => e.start.split(' ')[0],
        );
        setEventsByDate(grouped);
      }
      setLoader(false);
    } catch (error) {
      console.error('Failed to fetch schedule events', error);
      Alert.alert('Error', 'Failed to load schedule events.');
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const marked = useMemo(() => {
    const marks: any = {};
    Object.keys(eventsByDate).forEach(date => {
      marks[date] = { marked: true };
    });
    return marks;
  }, [eventsByDate]);

  const onDateChanged = useCallback((date: string) => {
    setCurrentDate(date);
  }, []);

  const handleEventPress = (
    event: TimelineEventProps & { bookingId: string },
  ) => {
    if (event.bookingId) {
      navigation.navigate('BookingDetailsScreen', {
        bookingId: event.bookingId,
      });
    }
  };

  const timelineProps: Partial<TimelineProps> = useMemo(
    () => ({
      format24h: true,
      onEventPress: handleEventPress as any,
      overlapEventsSpacing: 8,
      rightEdgeSpacing: 24,
    }),
    [navigation],
  );

  if (loader && Object.keys(eventsByDate).length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <CommonContainer
      title="Schedules"
      noPadding={true}
      hideHeader={false}
      rightIcon={
        <Ionicons name="list-circle" size={28} color={theme.colors.primary} />
      }
      onRightIconPress={() => navigation.navigate('BookingScreen')}
    >
      <View style={styles.container}>
        <CalendarProvider
          date={currentDate}
          onDateChanged={onDateChanged}
          showTodayButton
          disabledOpacity={0.6}
        >
          <ExpandableCalendar
            firstDay={1}
            markedDates={marked}
            renderArrow={(direction: any) => (
              <Ionicons
                name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
                size={24}
                color="#007AFF"
              />
            )}
            theme={{
              selectedDayBackgroundColor: '#007AFF',
              todayTextColor: '#007AFF',
              dotColor: '#007AFF',
            }}
          />
          <TimelineList
            key="timeline"
            events={eventsByDate}
            timelineProps={timelineProps as any}
            showNowIndicator
            scrollToFirst
            initialTime={INITIAL_TIME}
          />
        </CalendarProvider>
      </View>
    </CommonContainer>
  );
};

export default SchedulesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
