import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import theme from '../../utils/Theme';

const Section = ({ title, data, renderItem, horizontal }) => (
  <View style={{ marginTop: theme.spacing.lg }}>
    <Text style={styles.title}>{title}</Text>
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingLeft: 16 }}
      renderItem={({ item }) => React.createElement(renderItem, { ...item })}
    />
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.subheading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.md,
  },
});

export default Section;
