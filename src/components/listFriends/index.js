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

import { Icon, FormLabel, FormInput, ButtonGroup } from 'react-native-elements'
import axios from 'axios'
import * as Animatable from 'react-native-animatable'
import Modal from 'react-native-modal'
import { Avatar } from 'react-native-elements'
const { width } = Dimensions.get('window')
var AnimatableTouchableOpacity = Animatable.createAnimatableComponent(TouchableOpacity)
var AnimatableIcon = Animatable.createAnimatableComponent(Icon)

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
    this._showModal= this._showModal.bind(this)
    this._closeModal= this._closeModal.bind(this)
    this.selectButton = this.selectButton.bind(this)
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
      isActionButtonVisible: true,
      buttonFollow: false
    }
  }

  componentWillMount() {
    this.getApi()
  }

  getApi() {
    const {page,gender} = this.state
    return axios.get(`https://randomuser.me/api/?page=${page}&gender=${gender}&results=15`)
      .then(response => {
        this.setState({
          dataUser: response.data.results
        })
      })
      .catch(error => {
        return error
      })
  }

  updateIndex(selectedIndex) {
    Keyboard.dismiss()
    let gender
    if (selectedIndex === 0) {
       gender = 'female'
    } else if (selectedIndex === 1){
       gender = null
    } else {
       gender = 'male'
    }
    this.setState({
      selectedIndex,
      gender
    })
  }

  _showModal() {
    this.setState({ isModalVisible: !this.state.isModalVisible })
  }
  _closeModal() {
    const {page,gender} = this.state
    const pageN = 1
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      dataUser:[]
    })
    axios.get(`https://randomuser.me/api/?page=${pageN}&gender=${gender}&results=15`)
      .then(response => {
        this.setState({
          dataUser: response.data.results
        })
      })
  }

  onPressDetail(name, image) {
    this.props.navigator.push({
      screen: 'detail', // unique ID registered with Navigation.registerScreen
      backButtonTitle: '', // override the back button title (optional)
      passProps: {
        userName: name,
        userImg: image
      }
    })
  }

  _onRefresh = () => {
    this.setState({
      refreshing: true,
      gender: null,
      selectedIndex: 1
    })
    axios.get(`https://randomuser.me/api/?page=1&gender=null&results=15`)
      .then(response => {
        this.setState({
          ...this.state,
          dataUser: response.data.results,
          refreshing: false
        })
      })
      .catch(error => {
        return error
      })
  }

  selectButton() {
    this.setState({
      buttonFollow: !this.state.buttonFollow
    })
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
        scrollEventThrottle={16}
        initialListSize={1000}
        enableEmptySections={true}
        refreshControl={
          <RefreshControl
            tintColor="#03a9f4"
            titleColor="#fff"
            title="Loading ..."
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
        renderRow={(rowData) => {
          index++
          return (
            <Animatable.View useNativeDriver={true} animation="bounceIn" style={[styles.btnTouch, { marginTop: index % 3 === 2 ? -30 : 20, marginHorizontal: (width - 30) * 0.0166 }]}>
              <TouchableOpacity onPress={() => this.onPressDetail(rowData.name.first, rowData.picture.large)} style={{ flex: 1 }}>
                <Image style={[styles.avt]} source={{ uri: rowData.picture.large }} />
                <Text style={[styles.txtName]}>{rowData.name.first}</Text>
              </TouchableOpacity>
            </Animatable.View>
          )
        }}
        onEndReached={onListEndReached}
        renderFooter={renderLoadingFooter}
        onEndReachedThreshold={100}
      />
    )
  }

  renderView = () => {
    const buttons = ['Girls', 'Both', 'Boy']
    const { selectedIndex } = this.state
    return (
      <View>
        {this.renderListView()}
        <Icon reverse containerStyle={{ backgroundColor: '#03a9f4', position: 'absolute', right: 10, bottom: 10 }} color="#222233" onPress={this._showModal} underlayColor="red" name='settings' />

        <Modal isVisible={this.state.isModalVisible} style={{ justifyContent: 'flex-end', margin: 0, }}>

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
              <TouchableOpacity  style={[styles.btnFollow, { backgroundColor: this.state.buttonFollow ? '#4E97DB' : null }]} onPress={this.selectButton}>
                <Text style={[styles.txtButton]}>Asian</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnFollow, {marginLeft: 10}]}>
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
    return (
      <View style={styles.container}>
        {this.state.dataUser.length === 0 ? <ActivityIndicator size="large" color="#03a9f4"/> : this.renderView()}
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
