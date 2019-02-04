import React, { Component } from 'react'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing, TouchableOpacity  } from 'react-native'
import { connect } from 'react-redux';
import { Actions } from './Actions';
import { ScrollView } from 'react-native-gesture-handler';
import { COLLECTION_EDITOR } from './types';
import { DropDownHolder } from './DropDownHolder';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

class CollectionEditor extends Component {

  componentWillUnmount() {
    this.props.resetCollection();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collectionMessage && (this.props.collectionMessage !== nextProps.collectionMessage)) {
        DropDownHolder.alert('info', 'Success!', nextProps.collectionMessage);
      }
      if (nextProps.currentCollection.deck.length === 0) {
        this.props.navigation.navigate('PackList', { mode: COLLECTION_EDITOR });
      }
  }

  render () {
    console.log(Object.keys(this.props.collections));
    return (
      <View style={styles.container}>
        <Text style={styles.logoText}>{`'${this.props.currentCollection.name}' Pack`}</Text>
        <ScrollView style={styles.scrollContainer}>
          {
            this.props.currentCollection.deck.map((card, index) => (
            <View style={styles.cardView} key={index}>
            <View style={styles.blockView}><Text>{card.question}</Text></View>
            <View style={styles.blockView}><Text>{card.answer}</Text></View>
            <TouchableOpacity 
              onPress={() => this.props.removeCardFromCollection(this.props.currentCollection.name, card.question)}
              key={index}
              style={styles.button}>
                  <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
            </View>
            )
        )
      }
        </ScrollView>
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
  cardView: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  blockView: {
    width: width * 0.3
  },
  logoText: {
    textAlign: 'center',
    margin: 20,
    fontSize: 25,
    backgroundColor: 'transparent'
  },
  scrollContainer: {
    width: width * 0.8
  },
  button: {
    margin: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 8,
    borderRadius: 50
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

const mapStateToProps = state => {
  return {
    currentCollection: state.collectionsStore.current,
    isCollectionSelected: state.collectionsStore.isCollectionSelected,
    collections: state.collectionsStore.collections,
    collectionMessage: state.collectionsStore.message,
  }
};

const mapDispatchToProps = (dispatch) => ({
  setCollection: (collectionKey) => dispatch(Actions.setCollection(collectionKey)),
  removeCardFromCollection: (collectionName, question) => dispatch(Actions.removeCardFromCollection(collectionName, question)),
  resetMode: () => dispatch(Actions.resetMode()),
  resetCollection: () => dispatch(Actions.resetCollection())
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionEditor);