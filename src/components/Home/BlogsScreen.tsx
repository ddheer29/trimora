import React from 'react';
import { FlatList } from 'react-native';
import theme from '../../utils/Theme';
import { beautyBlogs } from '../../utils/data';
import Section from './Section';
import BlogCard from '../Cards/BlogCard';

const BlogsScreen = () => {
  return (
    <FlatList
      ListHeaderComponent={
        <Section
          title="Tips & Beauty Blogs"
          data={beautyBlogs}
          renderItem={BlogCard}
        />
      }
      contentContainerStyle={{ backgroundColor: theme.colors.background }}
    />
  );
};

export default BlogsScreen;
