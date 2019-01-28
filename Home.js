import React, { Component } from 'react'
import Swiper from './Swiper'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing, TouchableOpacity  } from 'react-native'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

export default class Home extends Component {

  render () {
    return (
      <View style={styles.container}>
          <Text style={styles.logoText}>Cards</Text>
            <TouchableOpacity 
            style={styles.button}
            onPress={() => this.props.navigation.navigate('PackList')}>
                <Text style={styles.buttonText}>GO</Text>
            </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoText: {
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  button: {
    margin: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 25,
    borderRadius: 50
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})
