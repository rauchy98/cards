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

class Home extends Component {

  componentWillReceiveProps(nextProps) {
    if (!this.props.isModeSelected && nextProps.isModeSelected) {
      this.props.navigation.navigate('PackList');
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.logoText}>Cards</Text>
        <View style={styles.buttonsContainer}>
          {
            this.props.modes.map((mode, index) => {            
            return <TouchableOpacity 
            key={index}
            style={styles.button}
            onPress={() => { this.props.setMode(mode) }}>
                <Text style={styles.buttonText}>{mode}</Text>
            </TouchableOpacity>
            })
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
    fontSize: 50,
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  button: {
    margin: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 25,
    borderRadius: 50
  },
  buttonsContainer: {
    marginTop: 15
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
})


const mapStateToProps = state => {
  return {
    currentMode: state.modesStore.selectedMode,
    isModeSelected: state.modesStore.isModeSelected,
    modes: state.modesStore.modes
  }
};

const mapDispatchToProps = (dispatch) => ({
  setMode: (mode) => dispatch(Actions.setMode(mode)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);