import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  ListView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  RefreshControl,
  Button,
  Dimensions,
  Platform,
  View
} from 'react-native'
import * as Animatable from 'react-native-animatable';
import { Avatar } from 'react-native-elements'
import data from '../../data'
const { width } = Dimensions.get('window')
var AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity);

export default class ListFriend extends Component {

  static navigatorStyle = {
    navBarHideOnScroll: true,
    navBarButtonColor: "#fff",
    drawUnderNavBar: true,
    navBarTranslucent: true,
    navBarTransparent: true,
    navBarBackgroundColor: '#222233',
    screenBackgroundColor: '#222233',
    navBarTextColor: '#ccc',
    // navBarHideOnScroll: true,
  }

  constructor(props) {
    super(props)
    this.renderListView = this.renderListView.bind(this)
   // this.onPressDetail = this.onPressDetail.bind(this)
    this.state = {
      buttonFollow: false,
      refreshing: false,
    }
  }

  onPressDetail(data) {
    this.props.navigator.push({
      screen: 'detail', // unique ID registered with Navigation.registerScreen
      backButtonTitle: '', // override the back button title (optional)
      passProps: {
        userName: data
      }
    });
  }

  _onRefresh() {
    this.setState({refreshing: true});
    setTimeout(function(){
      this.setState({refreshing: false});
    }.bind(this),2000)
  }

  renderListView = () => {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    const dataSource = ds.cloneWithRows(data.results)
    let index = 0
    return (
      <ListView
        dataSource={dataSource}
        contentContainerStyle={[styles.listViewStyle]}
        scrollEventThrottle={16}
        initialListSize={15}
        refreshControl={
          <RefreshControl
            tintColor="#fff"
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        renderRow={(rowData) => {
          index++
          return (
            <Animatable.View useNativeDriver={true} animation="bounceIn" style={[styles.btnTouch,{ marginTop: index % 3 === 2 ? -30 : 20, marginHorizontal: (width-30) * 0.0166 }]}>
              <TouchableOpacity onPress={()=>this.onPressDetail(rowData.name.first)}  style={{flex: 1}}>
                <Image style={[styles.avt]} source={{uri: rowData.picture.large}}/>
                <Text style={[styles.txtName]}>{rowData.name.first}</Text>
              </TouchableOpacity>
            </Animatable.View>
          )
        }}
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
    backgroundColor: '#222233'
  },
  listViewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    paddingTop: 40,
    marginTop: 30
  },
  btnTouch: {
    width: (width - 30) * 0.3,
    height: (width - 30) * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  avt: {
    width: width*0.26,
    height: width*0.26,
    borderRadius: (width*0.26) /2,
  },
  txtName: {
    color: '#fff',
    textAlign: 'center'
  }
})
