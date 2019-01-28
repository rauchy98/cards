import React, { Component } from 'react'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing } from 'react-native'
import ClassicDeck from './ClassicDeck';
import { Actions } from './Actions';
import { connect } from 'react-redux';
import { CLASSIC_MODE, TESTING_MODE } from './constants';
import TestingDeck from './TestingDeck';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

class Application extends Component {

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

  componentWillUnmount() {
    this.props.resetCollection();
  }

  renderMode() {
    switch(this.props.currentMode) {
      case CLASSIC_MODE: return <ClassicDeck deck={this.props.currentCollection.deck} />
      case TESTING_MODE: return <TestingDeck deck={this.props.currentCollection.deck} />
    }
  }

  render () {
    return (
      <View style={styles.container}>
        { this.renderMode() }
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

const mapStateToProps = state => {
  return {
    currentCollection: state.collectionsStore.current,
    currentMode: state.modesStore.selectedMode,
  }
};

const mapDispatchToProps = (dispatch) => ({
  resetCollection: () => dispatch(Actions.resetCollection()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);