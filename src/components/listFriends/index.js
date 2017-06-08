import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  ListView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  View
} from 'react-native'
import * as Animatable from 'react-native-animatable';
import { Avatar } from 'react-native-elements'
import data from '../../data'
const { width } = Dimensions.get('window')
console.log(width)

var AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);

export default class ListFriend extends Component {

  static navigatorStyle = {
    navBarBackgroundColor: '#000',
    // navBarHideOnScroll: true,
  }

  constructor(props) {
    super(props)
    this.renderListView = this.renderListView.bind(this)
    this.onPressDetail = this.onPressDetail.bind(this)
  }

  onPressDetail() {
    this.props.navigator.push({
      screen: 'homeScreen', // unique ID registered with Navigation.registerScreen
      title: undefined, // navigation bar title of the pushed screen (optional)
      // titleImage: require('../../img/my_image.png'), //navigation bar title image instead of the title text of the pushed screen (optional)
      // passProps: {}, // Object that will be passed as props to the pushed screen (optional)
      // animated: true, // does the push have transition animation or does it happen immediately (optional)
      // backButtonTitle: undefined, // override the back button title (optional)
      // backButtonHidden: false, // hide the back button altogether (optional)
      // navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
      // navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
    });
  }

  renderListView = () => {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    const dataSource = ds.cloneWithRows(data.results)
    return (
      <ListView
        dataSource={dataSource}
        contentContainerStyle={[styles.listViewStyle]}
        scrollEventThrottle={16}
        renderRow={(rowData) => {
          return (
            <TouchableOpacity onPress={this.onPressDetail} animation="fadeIn" style={[styles.btnTouch]}>
              <Image style={[styles.avt]} source={{uri: rowData.picture.large}}/>
            </TouchableOpacity>
          )
        }}
        // onEndReached={this.onTicketListEndReached}
        // renderFooter={this.renderTicketFooter}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderListView()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  listViewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  btnTouch: {
    width: width * 0.3,
    height: width * 0.3,
    marginLeft: width * 0.026,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  avt: {
    width: width*0.27,
    height: width*0.27,
    borderRadius: (width*0.27) /2,
    flex: 1
  }
})
