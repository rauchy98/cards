import React, { Component } from 'react'
import Swiper from './Swiper'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing } from 'react-native'
import CardWrapper from './CardWrapper';
import DeckWrapper from './DeckWrapper';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

export default class Application extends Component {

  state = {
    deck: [
    {id: 1, question: 'Apple', answer: 'Яблуко'},
    {id: 2, question: 'Blackberry', answer: 'Ожина'},
    {id: 3, question: 'Melon', answer: 'Диня'},
    {id: 4, question: 'Peach', answer: 'Персик'},
    {id: 5, question: 'Redcurrant', answer: 'Смородина'},
    {id: 6, question: 'Pomegranate', answer: 'Гранат'},
    {id: 7, question: 'Plum', answer: 'Слива'}]
  };

  render () {
    return (
      <View style={styles.container}>
          <DeckWrapper deck={this.state.deck} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0'
  }
})
