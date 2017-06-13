/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  PixelRatio,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Button,
  Image,
  View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
const { width } = Dimensions.get('window')

export default class Detail extends Component {

  static navigatorStyle = {
    navBarHideOnScroll: false,
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
    this.state = {
      buttonFollow: false
    }
    this.selectButton = this.selectButton.bind(this)
  }

  selectButton() {
    this.setState({
      buttonFollow: !this.state.buttonFollow
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <ScrollView bounces={false}>
          <Animatable.Image useNativeDriver={true} animation="fadeIn" style={[styles.imgBanner]} source={require('../../asset/girl.jpg')} />
          <View style={{ padding: 20, }}>
            <Animatable.View useNativeDriver={true} duration={700} animation="fadeInRight" style={[styles.rowName]}>
              <View style={[styles.colName]}>
                <Text style={[styles.txtUserName]}>{(this.props.userName).toUpperCase()}</Text>
                <Text style={[styles.txtSub]}>The United Kingdom</Text>
              </View>
              <TouchableOpacity style={[styles.btnFollow, { backgroundColor: this.state.buttonFollow ? '#4E97DB' : null }]} onPress={this.selectButton}>
                <Text style={[styles.txtButton]}>Follow</Text>
              </TouchableOpacity>
            </Animatable.View>

            <View style={{flexDirection: 'row', marginTop: 20}}>
              <Animatable.Image delay={100} animation="fadeInRight" style={[styles.avt]} source={{ uri: this.props.userImg }} />
              <Animatable.Text delay={100} animation="fadeInRight" style={[styles.txtIntro]}>Lorem ipsum dolor sit amet. Explicabo facere hic iusto maxime neque optio quibusdam reprehit sequi tenetur unde. Ab cumque error iusto molestiae natus, quas sunt vel vero.</Animatable.Text>
            </View>

            <Animatable.Text delay={200} animation="fadeInUp" style={[styles.txtLabel]}>LOOKING FOR</Animatable.Text>
            <Animatable.Text delay={200} animation="fadeInUp" style={[styles.txtFood]}>Asian - Food - Heath - Shushi - Sea Food - Vegateble - Wine</Animatable.Text>

          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222233',
  },
  imgBanner: {
    width: width
  },
  rowName: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  colName: {
    flex: 1,
  },
  avt: {
    width: width * 0.26,
    height: width * 0.26,
    borderRadius: (width * 0.26) / 2,
    alignSelf:'center',
  },
  txtUserName: {
    fontSize: 19,
    color: '#fff',
    fontWeight: '400',
  },
  txtSub: {
    color: '#999',
    marginTop: 3
  },
  txtButton: {
    color: '#fff',
    fontSize: 15,
  },
  btnFollow: {
    paddingHorizontal: 55,
    borderRadius: 25,
    justifyContent: 'center',
    height: 40,
    borderWidth: 4 / PixelRatio.get(),
    borderColor: '#4E97DB'
  },
  txtIntro: {
    color: '#e5e5e5',
    fontSize: 14,
    paddingLeft: 15,
    flex: 1,
    textAlign: 'left'
  },
  txtLabel: {
    marginTop: 40,
    color: '#999',
    fontWeight: '500'
  },
  txtFood: {
    marginTop: 10,
    color: '#fff'
  }

});
