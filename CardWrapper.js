import React, { Component } from 'react'
import Swiper from './Swiper'
import { REPEAT, LEARNED, CARD_SIZE_MULTIPLIER, ANOTHER_CARD_SIZE_MULTIPLIER } from './constants'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing } from 'react-native'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

export default class CardWrapper extends Component {

  constructor(props) {
    super(props);

    this._gestureStartPosition = {x: 0, y: 0};

    this.state = {
      question: "",
      answer: "",
      show: "",
      pan: new Animated.ValueXY({x: 0, y: 400}),
      color: new Animated.Value(0),
      rotate: new Animated.Value(0),
      cardScale: new Animated.Value(1),
      selected: new Animated.Value(0),
      cardOpacity: new Animated.Value(0),
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
      },
      onPanResponderMove: (e, gesture) => {
        const isInRadius = Math.sqrt(gesture.dx * gesture.dx + gesture.dy * gesture.dy);
        this.setState({
          isInRadius
        })
        this.state.color.setValue(isInRadius);

        return Animated.event([
          null, { dx: this.state.pan.x, dy: this.state.pan.y }
        ])(e, gesture);
      },
      onPanResponderRelease: (e, gesture) => {
        
        Animated.timing(this.state.selected, {
          toValue: 0,
          duration: 130,
          ActiveNativeDriver: true,
        }).start();

        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          if (this.state.rotate._value === 0) {
            Animated.timing(this.state.rotate, {
              toValue: 50,
              duration: 150,
              ActiveNativeDriver: true,
              easing: Easing.inOut(Easing.in)
            }).start(res => {
              this.setState(prevState => ({show: prevState.answer}), () => {
                Animated.timing(this.state.cardScale, {
                  toValue: -1,
                  duration: 1,
                  ActiveNativeDriver: true,
                }).start(res => {
                  Animated.timing(this.state.rotate, {
                    toValue: 100,
                    duration: 250,
                    easing: Easing.out(Easing.in),
                    ActiveNativeDriver: true,
                  }).start();
                });
              })
            });
          }
          else {
            Animated.timing(this.state.rotate, {
              toValue: 50,
              duration: 150,
              easing: Easing.inOut(Easing.in),
              ActiveNativeDriver: true,
            }).start(res => {
              this.setState(prevState => ({show: prevState.question}), () => {
                Animated.timing(this.state.cardScale, {
                  toValue: 1,
                  duration: 1,
                  ActiveNativeDriver: true,
                }).start(res => {
                  Animated.timing(this.state.rotate, {
                    toValue: 0,
                    duration: 250,
                    easing: Easing.out(Easing.in),
                    ActiveNativeDriver: true,
                  }).start();
                });
              })
            });
          }
        }
        else if (this.state.isInRadius > 180 || Math.abs(gesture.vx) > 0.7) {
          const newVector = {x: gesture.dx * 10, y: gesture.dy * 10};

          const result = this.removeCard(gesture.dx);

          Animated.timing(this.state.pan, {
            toValue: { x: newVector.x, y: newVector.y },
            duration: 1000,
            easing: Easing.out(Easing.quad),
            ActiveNativeDriver: true,
          }).start();

          this.props.showResult(result);

          setTimeout(() => {
            this.props.cardSwiped(this.props.children.id, result);
          }, 700)

        }
        else {
          Animated.spring(this.state.pan, {
            toValue: { x: 0, y: 0 },
            ActiveNativeDriver: true,
            friction: 5
          }).start();
        }
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

    setTimeout(() => {
      Animated.timing(this.state.pan, {
        toValue: { x: 0, y: 0 },
        duration: 700,
        easing: Easing.out(Easing.quad),
        ActiveNativeDriver: true,
      }).start();
  
      Animated.timing(this.state.cardOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.quad),
        ActiveNativeDriver: true,
      }).start();
    }, 200)

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
          <Animated.View style={[panStyle, styles.card, 
            {
              backgroundColor: this.state.pan.x.interpolate({
              inputRange: [-400, -40, 0, 40, 400],
              outputRange: ['rgba(0, 200, 0, 0.3)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(220, 0, 0, 0.3)']
            }),
              borderWidth: this.state.selected.interpolate({
                inputRange: [0, 1],
                outputRange: [2, 7]
              }),
              opacity: this.state.cardOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
              }),
          }]} {...this.panResponder.panHandlers}>
              <Text style={styles.text}>{this.state.show}</Text>
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
    position: 'absolute',
    borderRadius: 4,
    height: height*CARD_SIZE_MULTIPLIER,
    width: (height*CARD_SIZE_MULTIPLIER) / 1.5,
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
