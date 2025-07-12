import {StyleSheet} from 'react-native';
import React, {FC} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SummaryScreen from '../screens/ResultScreens/SummaryScreen';
import {colors, fontFamily, fontSizes} from '../utils/Theme';
import AnalysisScreen from '../screens/ResultScreens/AnalysisScreen';
import SolutionsScreen from '../screens/ResultScreens/SolutionsScreen';
import RankingScreen from '../screens/ResultScreens/RankingScreen';
import RelatedTestsScreen from '../screens/ResultScreens/RelatedTestsScreen';
import {moderateScale} from 'react-native-size-matters';

const Tab = createMaterialTopTabNavigator();

type ResultTopBarNavigator2Props = {
  testId: string;
};

const ResultTopBarNavigator2: FC<ResultTopBarNavigator2Props> = ({testId}) => {
  return (
    <Tab.Navigator
      initialRouteName="SummaryScreen"
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarIndicatorStyle: {
          borderColor: colors.primary1,
          height: 2,
        },
        tabBarStyle: {
          elevation: 0,
          shadowOffset: {width: 0, height: 0},
        },
        tabBarItemStyle: {
          width: 'auto',
          paddingHorizontal: moderateScale(16),
          paddingVertical: moderateScale(8),
        },
        tabBarContentContainerStyle: {justifyContent: 'center'},
      }}>
      <Tab.Screen
        name="SummaryScreen"
        initialParams={{testId}}
        options={({navigation}) => ({
          title: 'Summary',
          tabBarLabelStyle: {
            fontSize: fontSizes.regular,
            fontFamily: fontFamily.semibold,
            textTransform: 'none',
            color: navigation.isFocused() ? colors.primary1 : colors.grey1,
          },
        })}
        component={SummaryScreen}
      />
      <Tab.Screen
        name="AnalysisScreen"
        initialParams={{testId}}
        options={({navigation}) => ({
          title: 'Analysis',
          tabBarLabelStyle: {
            fontSize: fontSizes.regular,
            fontFamily: fontFamily.semibold,
            textTransform: 'none',
            color: navigation.isFocused() ? colors.primary1 : colors.grey1,
          },
        })}
        component={AnalysisScreen}
      />
      <Tab.Screen
        name="SolutionsScreen"
        initialParams={{testId}}
        options={({navigation}) => ({
          title: 'Solutions',
          tabBarLabelStyle: {
            fontSize: fontSizes.regular,
            fontFamily: fontFamily.semibold,
            textTransform: 'none',
            color: navigation.isFocused() ? colors.primary1 : colors.grey1,
          },
        })}
        component={SolutionsScreen}
      />
      <Tab.Screen
        name="RankingScreen"
        initialParams={{testId}}
        options={({navigation}) => ({
          title: 'Ranking',
          tabBarLabelStyle: {
            fontSize: fontSizes.regular,
            fontFamily: fontFamily.semibold,
            textTransform: 'none',
            color: navigation.isFocused() ? colors.primary1 : colors.grey1,
          },
        })}
        component={RankingScreen}
      />
      <Tab.Screen
        name="RelatedTestsScreen"
        initialParams={{testId}}
        options={({navigation}) => ({
          title: 'RelatedTest',
          tabBarLabelStyle: {
            fontSize: fontSizes.regular,
            fontFamily: fontFamily.semibold,
            textTransform: 'none',
            color: navigation.isFocused() ? colors.primary1 : colors.grey1,
          },
        })}
        component={RelatedTestsScreen}
      />
    </Tab.Navigator>
  );
};

export default ResultTopBarNavigator2;

const styles = StyleSheet.create({});
