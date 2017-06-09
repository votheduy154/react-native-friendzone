import { Navigation } from 'react-native-navigation';

import homeScreen from '../components/homeScreen/';
import listFriends from '../components/listFriends';
import detail from '../components/detail';

export default function () {
  Navigation.registerComponent('homeScreen', () => homeScreen);
  Navigation.registerComponent('listFriends', () => listFriends);
  Navigation.registerComponent('detail', () => detail);
}