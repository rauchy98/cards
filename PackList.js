import React, { Component } from 'react'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing, TouchableOpacity  } from 'react-native'
import { connect } from 'react-redux';
import { Actions } from './Actions';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

class PackList extends Component {

  componentWillUnmount() {
    this.props.resetMode();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isCollectionSelected && nextProps.isCollectionSelected) {
      this.props.navigation.navigate('Application');
    }
  }

  render () {
    console.log(Object.keys(this.props.collections));
    return (
      <View style={styles.container}>
        <Text style={styles.logoText}>Choose a pack</Text>
        <View style={styles.buttonsContainer}>
          {
            this.props.collections.map((collection, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.button}
              onPress={() => { this.props.setCollection(collection.name) }}>
                  <Text style={styles.buttonText}>{collection.name}</Text>
            </TouchableOpacity>
            )
        )
      }
        </View>
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
  buttonsContainer: {
    marginTop: 15
  },
  button: {
    margin: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 20,
    borderRadius: 50
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
})

const mapStateToProps = state => {
  return {
    currentCollection: state.collectionsStore.current,
    isCollectionSelected: state.collectionsStore.isCollectionSelected,
    collections: state.collectionsStore.collections
  }
};

const mapDispatchToProps = (dispatch) => ({
  setCollection: (collectionKey) => dispatch(Actions.setCollection(collectionKey)),
  resetMode: () => dispatch(Actions.resetMode()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PackList);