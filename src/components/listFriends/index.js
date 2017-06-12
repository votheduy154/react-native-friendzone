import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  ListView,
  TouchableOpacity,
  UIManager,
  Image,
  Button,
  LayoutAnimation,
  Keyboard,
  PixelRatio,
  ActivityIndicator,
  TouchableHighlight,
  RefreshControl,
  Dimensions,
  Platform,
  View
} from 'react-native'

import ActionButton from 'react-native-action-button'
import { Icon, FormLabel, FormInput, ButtonGroup } from 'react-native-elements'
import axios from 'axios'
import * as Animatable from 'react-native-animatable'
import Modal from 'react-native-modal'
import { Avatar } from 'react-native-elements'
const { width } = Dimensions.get('window')
var AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity)
var AnimatableIcon = Animatable.createAnimatableComponent(Icon)

var  _listViewOffset = 0

export default class ListFriend extends Component {

  static navigatorStyle = {
    navBarHideOnScroll: true,
    navBarButtonColor: '#fff',
    drawUnderNavBar: true,
    navBarTranslucent: true,
    navBarTransparent: true,
    navBarBackgroundColor: '#222233',
    screenBackgroundColor: '#222233',
    navBarTextColor: '#ccc'

  }

  constructor(props) {
    super(props)
    this.renderListView = this.renderListView.bind(this)
    this.updateIndex = this.updateIndex.bind(this)
    // this.onPressDetail = this.onPressDetail.bind(this)
    this.state = {
      buttonFollow: false,
      refreshing: false,
      isModalVisible: false,
      selectedIndex: 1,
      bottomFooter: false,
      isFetchMore: false,
      page: 1,
      gender: null,
      dataUser: [],
      isActionButtonVisible: true
    }
  }

  componentWillMount() {
    const {page,gender} = this.state
    axios.get(`https://randomuser.me/api/?page=${page}&gender=${gender}&results=15`)
      .then(response => {
        this.setState({
          dataUser: response.data.results
        })
        console.log(this.state.dataUser)
      })
      .catch(error => {
        return error
      })
  }

  updateIndex(selectedIndex) {
    Keyboard.dismiss()
    this.setState({ selectedIndex })
  }

  _showModal = () => this.setState({ isModalVisible: !this.state.isModalVisible })

  _closeModal = () => {
    const {page,gender} = this.state
    const pageN = 1
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      gender: 'female',
      dataUser: []
    })
    axios.get(`https://randomuser.me/api/?page=${pageN}&gender=female&results=15`)
      .then(response => {
        this.setState({
          dataUser: response.data.results
        })
      })

  }

  onPressDetail(data) {
    this.props.navigator.push({
      screen: 'detail', // unique ID registered with Navigation.registerScreen
      backButtonTitle: '', // override the back button title (optional)
      passProps: {
        userName: data
      }
    })
  }

  _onRefresh = () => {
    this.setState({
      refreshing: true,
      page: 1,
      gender: null,
    })
    const { gender, page } = this.state
    axios.get(`https://randomuser.me/api/?page=${page}&gender=${gender}&results=15`)
      .then(response => {
        this.setState({
          dataUser: response.data.results
        })
      })
     this.setState({ refreshing: false })
  }

  _onScroll = (event) => {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 100,
      create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
    }
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
      ? 'down'
      : 'up'
    // console.log(direction)
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === 'up'
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear)
      this.setState({ isActionButtonVisible })
    }
    // Update your scroll position
    this._listViewOffset = currentOffset
    // console.log(currentOffset)
  }

  renderListView = () => {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    const dataSource = ds.cloneWithRows(this.state.dataUser)
    let index = 0

    const renderLoadingFooter = () => {
      return (
        this.state.bottomFooter ? <ActivityIndicator style={{marginBottom: 20}} size="large" color="#03a9f4"/> : null
      )
    }

    const onListEndReached = () => {
      let { gender, page } = this.state
      let pageNew = page + 1
      this.setState({
        bottomFooter: true,
      })
      axios.get(`https://randomuser.me/api/?page=${pageNew}&gender=${gender}&results=15`)
        .then((response) => {
          this.setState({
            ...this.state,
            dataUser: [...this.state.dataUser, ...response.data.results],
            bottomFooter: false,
          })
        })
    }
    return (
      <ListView
        dataSource={dataSource}
        contentContainerStyle={[styles.listViewStyle]}
        // bounces={false}
        scrollEventThrottle={16}
       // onScroll={this._onScroll}
        initialListSize={30}
        enableEmptySections={true}
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
            <Animatable.View useNativeDriver={true} animation="bounceIn" style={[styles.btnTouch, { marginTop: index % 3 === 2 ? -30 : 20, marginHorizontal: (width - 30) * 0.0166 }]}>
              <TouchableOpacity onPress={() => this.onPressDetail(rowData.name.first)} style={{ flex: 1 }}>
                <Image style={[styles.avt]} source={{ uri: rowData.picture.large }} />
                <Text style={[styles.txtName]}>{rowData.name.first}</Text>
              </TouchableOpacity>
            </Animatable.View>
          )
        }}
        onEndReached={onListEndReached}
        renderFooter={renderLoadingFooter}
        onEndReachedThreshold={50}

      />
    )
  }

  renderView = () => {
    const buttons = ['Girls', 'Both', 'Boy']
    const { selectedIndex } = this.state
    return (
      <View>
        {this.renderListView()}

        {
          this.state.isActionButtonVisible ? <Icon reverse containerStyle={{ backgroundColor: '#03a9f4', position: 'absolute', right: 10, bottom: 10 }} color="#222233" onPress={this._showModal} underlayColor="red" name='settings' /> : null
        }

        <Modal animationOut="fadeOutDown" animationIn="fadeInUp" isVisible={this.state.isModalVisible} style={{ justifyContent: 'flex-end', margin: 0 }}>


          <View style={{ backgroundColor: '#222233', paddingHorizontal: 10, paddingBottom: 20 }}>

            <FormLabel labelStyle={{ color: '#fff' }}>Location</FormLabel>
            <FormInput autoCorrect={false} underlineColorAndroid="transparent" placeholderTextColor="#999" placeholder="Location here ..." inputStyle={{ paddingHorizontal: 20 }} containerStyle={{ borderWidth: 1, marginTop: 10, borderColor: '#999', borderRadius: 30 }} />

            <FormLabel labelStyle={{ color: '#fff' }}>Show me</FormLabel>
            <View style={{ paddingHorizontal: 10 }}>
              <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedIndex}
                buttons={buttons}
                selectedTextStyle={{ color: '#fff' }}
                selectedBackgroundColor="#03a9f4"
                underlayColor="#03a9f4"
                textStyle={{ color: '#999' }}
                containerStyle={{ height: 36, borderRadius: 18, borderWidth: 1, marginTop: 10, borderColor: '#999', backgroundColor: '#222233' }}
              />
            </View>

            <View style={{ paddingHorizontal: 20, flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity style={[styles.btnFollow, { backgroundColor: this.state.buttonFollow ? '#4E97DB' : null }]} onPress={this.selectButton}>
                <Text style={[styles.txtButton]}>Asian</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnFollow, { backgroundColor: this.state.buttonFollow ? '#4E97DB' : null, marginLeft: 10 }]} onPress={this.selectButton}>
                <Text style={[styles.txtButton]}>Shushi</Text>
              </TouchableOpacity>
            </View>

            <Icon
              reverse
              containerStyle={{ backgroundColor: '#03a9f4', position: 'absolute', right: 10, bottom: 10 }}
              color="#222233"
              onPress={this._closeModal}
              underlayColor="red"
              name='check'
            />

          </View>
        </Modal>
      </View>
    )
  }

  render() {
    console.log(this.state)
    return (
      <View style={styles.container}>
        {
          this.state.dataUser.length === 0 ? <ActivityIndicator size="large" color="#03a9f4"/> : this.renderView()
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222233',
  },
  listViewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 15,
    paddingTop: 40,
    marginTop: 30,
    paddingBottom: 25
  },
  btnTouch: {
    width: (width - 30) * 0.3,
    height: (width - 30) * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  avt: {
    width: width * 0.26,
    height: width * 0.26,
    borderRadius: (width * 0.26) / 2
  },
  txtName: {
    color: '#fff',
    textAlign: 'center',
  },
  btnFollow: {
    width: 100,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    marginTop: 10,
    borderWidth: 4 / PixelRatio.get(),
    borderColor: '#4E97DB'
  },
  txtButton: {
    color: '#fff',
    fontSize: 15
  }
})
