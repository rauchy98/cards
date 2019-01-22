import React, { Component } from 'react'
import Swiper from './Swiper'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing, TouchableOpacity  } from 'react-native'
import CardWrapper from './CardWrapper';
import DeckWrapper from './DeckWrapper';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

export default class PackList extends Component {

  render () {
    return (
      <View style={styles.container}>
          <Text style={styles.logoText}>Choose a pack</Text>
            <TouchableOpacity 
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Application')}>
                <Text style={styles.buttonText}>Fruits</Text>
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
    fontSize: 25,
    backgroundColor: 'transparent'
  },
  button: {
    margin: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 20,
    borderRadius: 50
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})
