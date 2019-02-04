import React, { Component } from 'react'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing } from 'react-native'
import ClassicDeck from './ClassicDeck';
import { Actions } from './Actions';
import { connect } from 'react-redux';
import { CLASSIC_MODE, TESTING_MODE } from './constants';
import TestingDeck from './TestingDeck';
import { DropDownHolder } from './DropDownHolder';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

class Application extends Component {

  componentWillUnmount() {
    this.props.resetCollection();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collectionMessage && (this.props.collectionMessage !== nextProps.collectionMessage)) {
      DropDownHolder.alert('info', 'Success!', nextProps.collectionMessage);
    }
  }

  renderMode() {
    const commonProps = {
      deck: this.props.currentCollection.deck,
      addToFavorites: this.props.addToFavorites,
    };

    switch(this.props.currentMode) {
      case CLASSIC_MODE: return <ClassicDeck {...commonProps} />
      case TESTING_MODE: return <TestingDeck {...commonProps} />
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
    collectionMessage: state.collectionsStore.message,
    currentCollection: state.collectionsStore.current,
    currentMode: state.modesStore.selectedMode,
  }
};

const mapDispatchToProps = (dispatch) => ({
  addToFavorites: (question, answer) => dispatch(Actions.addToFavorites(question, answer)),
  resetCollection: () => dispatch(Actions.resetCollection()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);