import React, { Component } from 'react'
import { REPEAT, LEARNED, CARD_SIZE_MULTIPLIER, ANOTHER_CARD_SIZE_MULTIPLIER } from './constants'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing, TouchableOpacity } from 'react-native'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

export default class TestingCard extends Component {

  constructor(props) {
    super(props);

    this._gestureStartPosition = {x: 0, y: 0};

    this.state = {
      question: "",
      answer: "",
      show: "",
      pan: new Animated.ValueXY({x: 0, y: 0}),
      color: new Animated.Value(0),
      rotate: new Animated.Value(0),
      cardScale: new Animated.Value(1),
      selected: new Animated.Value(0),
      radius: 200,
      isInRadius: 0
    };
  }

  componentWillMount() {
    this._val = { x:0, y:0 }
    this.state.pan.addListener((value) => this._val = value);
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        Animated.timing(this.state.selected, {
          toValue: 1,
          duration: 100,
          ActiveNativeDriver: true,
        }).start();
      }
    });
  }

  componentDidMount() {
    const question = this.props.children.question;
    const answer = this.props.children.answer;

    this.setState({
      question,
      answer,
      show: `${question}`
    })
  }

  removeCard = (dx) => dx <= 0 ? LEARNED : REPEAT;

  onSwiped = (type) => {
    console.log(`on swiped ${type}`)
  }

  onSwipedAllCards = () => {
    this.setState({
      swipedAllCards: true
    })
  };

  render () {
    const panTr = { ...this.state.pan.getTranslateTransform() }

    const panStyle = {
      transform: [{translateX: this.state.pan.x},
        {translateY: this.state.pan.y}, 
        {skewY: this.state.pan.x.interpolate({
          inputRange: [-300, 0, 300],
          outputRange: ["-10deg", "0deg", "10deg"]
        })},
        {skewX: this.state.pan.x.interpolate({
          inputRange: [-300, 0, 300],
          outputRange: ["-10deg", "0deg", "10deg"]
        })},
        {rotateY: this.state.rotate.interpolate({
          inputRange: [0, 100],
          outputRange: ["0deg", "180deg"]
        })},
        {scaleX: this.state.cardScale}
      ]
    }

    return (
          <Animated.View style={[this.props.general ? panStyle : null, styles.card, 
            {
              backgroundColor: this.state.pan.x.interpolate({
              inputRange: [-400, -40, 0, 40, 400],
              outputRange: ['rgba(0, 200, 0, 0.3)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(220, 0, 0, 0.3)']
            }),
              borderWidth: this.state.selected.interpolate({
                inputRange: [0, 1],
                outputRange: [2, 7]
              })
          }]} {...this.panResponder.panHandlers}>
            <View style={{backgroundColor: 'blue', width: '100%', height: '65%'}}></View>
            <View style={{backgroundColor: 'red', width: '100%', height: '35%', flexDirection: 'row', flexWrap: 'wrap'}}>
              <TouchableOpacity style={{backgroundColor: 'green', width: '50%', height: '50%'}}></TouchableOpacity>
              <TouchableOpacity style={{backgroundColor: 'grey', width: '50%', height: '50%'}}></TouchableOpacity>
              <TouchableOpacity style={{backgroundColor: 'black', width: '50%', height: '50%'}}></TouchableOpacity>
              <TouchableOpacity style={{backgroundColor: 'white', width: '50%', height: '50%'}}></TouchableOpacity>
            </View>
              {/* <Text style={styles.text}>{this.state.show}</Text> */}
          </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    position: 'absolute',
    borderRadius: 4,
    height: width * 1.4,
    width: width*0.9,
    borderColor: '#E1E1E1',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  },
  done: {
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
    backgroundColor: 'transparent'
  },
})
