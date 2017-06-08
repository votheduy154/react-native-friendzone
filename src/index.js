import { Navigation } from 'react-native-navigation';
import registerScreens from './navigation';

registerScreens()

Navigation.startSingleScreenApp({
  screen: {
    screen: 'homeScreen',
    title: '',
    navigatorStyle: {
    //  navBarTranslucent: true,
      // navBarTransparent: true,
       navBarNoBorder: true,
      navBarBackgroundColor: '#F5FCFF',
      navBarHidden: true,
    }
  }
});
