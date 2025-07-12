import React, {useState} from 'react';
import {useWindowDimensions, StyleSheet} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';
import SummaryScreen from '../screens/ResultScreens/SummaryScreen';
import AnalysisScreen from '../screens/ResultScreens/AnalysisScreen';
import SolutionsScreen from '../screens/ResultScreens/SolutionsScreen';
import RankingScreen from '../screens/ResultScreens/RankingScreen';
import RelatedTestsScreen from '../screens/ResultScreens/RelatedTestsScreen';
import {colors, fontFamily, fontSizes} from '../utils/Theme';

const ResultTopBarNavigator = ({analysisData, solutionsData, relatedTests}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {key: 'summary', title: 'Summary'},
    {key: 'analysis', title: 'Analysis'},
    {key: 'solutions', title: 'Solutions'},
    {key: 'ranking', title: 'Ranking'},
    {key: 'relatedtest', title: 'Related tests'},
  ]);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'summary':
        return <SummaryScreen />;
      case 'analysis':
        return <AnalysisScreen analysisData={analysisData} />;
      case 'solutions':
        return <SolutionsScreen solutionsData={solutionsData} />;
      case 'ranking':
        return <RankingScreen />;
      case 'relatedtest':
        return <RelatedTestsScreen relatedTests={relatedTests} />;
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: colors.primary1, height: 2}}
      style={{backgroundColor: colors.white}}
      activeColor={colors.primary1}
      inactiveColor={colors.dark}
      labelStyle={{
        fontFamily: fontFamily.medium,
        fontSize: fontSizes.regular,
      }}
      tabStyle={{width: 'auto', paddingHorizontal: 20, paddingVertical: 12}}
      scrollEnabled
    />
  );

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar}
    />
  );
};

export default ResultTopBarNavigator;
