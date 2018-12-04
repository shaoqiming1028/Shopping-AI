import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import AuthScreen from './src/screens/Auth/AuthScreen';
import InputPhotoScreen from './src/screens/InputPhoto/InputPhotoScreen';
import PersonalScreen from './src/screens/Personal/PersonalScreen';
import RecommendScreen from './src/screens/RecommendScreen/RecommendScreen';
import ListResultScreen from './src/screens/ListResult/ListResultScreen';
import ProductDetailScreen from './src/screens/ProductDetail/ProductDetailScreen';
import configureStore from './src/store/configureStore';

const store = configureStore();

// Only do two things in App.js
// 1. Register Screens,
// 2. Start applicatoin by react navigation

// Register Screens
Navigation.registerComponent(
  'Shopping-Assistant.AuthScreen',
  () => AuthScreen,
  store,
  Provider
);

Navigation.registerComponent(
  'Shopping-Assistant.PhotoScreen',
  () => InputPhotoScreen,
  store,
  Provider
)

Navigation.registerComponent(
  'Shopping-Assistant.PersonalScreen',
  () => PersonalScreen,
  store,
  Provider
)

Navigation.registerComponent(
  'Shopping-Assistant.RecommendScreen',
  () => RecommendScreen,
  store,
  Provider
)

Navigation.registerComponent(
  'Shopping-Assistant.ListResultScreen',
  () => ListResultScreen,
  store,
  Provider
)

Navigation.registerComponent(
  'Shopping-Assistant.ProductDetailScreen',
  () => ProductDetailScreen
)

// Start a App
Navigation.startSingleScreenApp({
  screen:{
    screen:'Shopping-Assistant.AuthScreen',
    title: 'Login',
    store,
    Provider
  }
})