/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Button } from 'react-native-elements'

export default class HomeScreen extends Component {


  static navigatorStyle = {
    navBarHideOnScroll: true,
    navBarButtonColor: "#fff",
    drawUnderNavBar: true,
    navBarTranslucent: true,
    navBarTransparent: true,
    navBarBackgroundColor: '#222233',
    screenBackgroundColor: '#222233',
    // navBarHideOnScroll: true,
  }

  constructor(props) {
    super(props);
    this.onPressList = this.onPressList.bind(this)
  }

  onPressList() {
    this.props.navigator.push({
      screen: 'listFriends', // unique ID registered with Navigation.registerScreen
      title: '', // navigation bar title of the pushed screen (optional)
      // titleImage: require('../../img/my_image.png'), //navigation bar title image instead of the title text of the pushed screen (optional)
      // passProps: {}, // Object that will be passed as props to the pushed screen (optional)
      // animated: true, // does the push have transition animation or does it happen immediately (optional)
      // backButtonTitle: undefined, // override the back button title (optional)
      // backButtonHidden: false, // hide the back button altogether (optional)
      // navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
      // navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.onPressList} backgroundColor='#03a9f4' large icon={{name: 'heartbeat', type: 'font-awesome'}} title='FRIEND ZONE' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222233',
  }
});
