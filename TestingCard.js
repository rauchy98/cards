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
      isButtonsTouchable: true,
      pan: new Animated.ValueXY({x: 0, y: 0}),
      color: new Animated.Value(0),
      rotate: new Animated.Value(0),
      cardScale: new Animated.Value(1),
      selected: new Animated.Value(0),
      firstButtonColor: new Animated.Value(0),
      secondButtonColor: new Animated.Value(0),
      thirdButtonColor: new Animated.Value(0),
      fourthButtonColor: new Animated.Value(0),
      radius: 200,
      isInRadius: 0
    };
  }

  // componentWillMount() {
  //   this._val = { x:0, y:0 }
  //   this.state.pan.addListener((value) => this._val = value);
  //   // Initialize PanResponder with move handling
  //   this.panResponder = PanResponder.create({
  //     onStartShouldSetPanResponder: (e, gesture) => true,
  //     onPanResponderGrant: (e, gesture) => {
  //       Animated.timing(this.state.selected, {
  //         toValue: 1,
  //         duration: 100,
  //         ActiveNativeDriver: true,
  //       }).start();
  //     }
  //   });
  // }

  componentDidMount() {
    const question = this.props.children.question;
    const answer = this.props.children.answer;

    console.log(this.props.children)

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

  chooseOption = (numberOfOption) => {
    this.setState({
      isButtonsTouchable: false
    });

    const selectedOption = this.props.children.options[numberOfOption];

    let animatedButton;
    
    switch(numberOfOption) {
      case 0: { animatedButton = this.state.firstButtonColor; break; }
      case 1: { animatedButton = this.state.secondButtonColor; break; }
      case 2: { animatedButton = this.state.thirdButtonColor; break; }
      case 3: { animatedButton = this.state.fourthButtonColor; break; }
      default: { animatedButton = this.state.firstButtonColor; break; }
    }

    if (selectedOption === this.props.children.answer) {

      Animated.sequence([
        Animated.timing(animatedButton, {
          toValue: -1,
          duration: 700,
          ActiveNativeDriver: true,
        }),
        Animated.timing(this.state.pan.x, {
          toValue: -600,
          duration: 400,
          ActiveNativeDriver: true,
        })
      ]).start(res => 
        this.props.optionChoosed(this.props.children.id, LEARNED)
      )
    }
    else {
      Animated.sequence([
        Animated.timing(animatedButton, {
          toValue: 1,
          duration: 700,
          ActiveNativeDriver: true,
        }),
        Animated.timing(this.state.pan.x, {
          toValue: 600,
          duration: 400,
          ActiveNativeDriver: true,
        })
      ]).start(res => 
        this.props.optionChoosed(this.props.children.id, REPEAT)
      )
    }
  }

  colorInterpolate = {
    inputRange: [-1, 0, 1],
    outputRange: ['rgba(124, 255, 117, 0.5)','rgba(255, 255, 255, 1)', 'rgba(255, 117, 117, 0.5)']
  };

  firstButtonColorInterpolate = () => this.state.firstButtonColor.interpolate(this.colorInterpolate);
  secondButtonColorInterpolate = () => this.state.secondButtonColor.interpolate(this.colorInterpolate);
  thirdButtonColorInterpolate = () => this.state.thirdButtonColor.interpolate(this.colorInterpolate);
  fourthButtonColorInterpolate = () => this.state.fourthButtonColor.interpolate(this.colorInterpolate);

  render () {
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
              outputRange: ['rgba(124, 255, 117, 0.5)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(255, 117, 117, 0.5)']
            })
          }]}>
            <TouchableOpacity
              onPress={() => this.props.addToFavorites(this.props.children.question, this.props.children.answer)}
              style={styles.addToFavoritesContainer}>
              <Text style={styles.addToFavoritesText}>+</Text>
            </TouchableOpacity>
            <View style={styles.questionContainer}><Text style={styles.questionText}>{this.props.children.question}</Text></View>
            <View style={styles.optionsContainer}>

              <TouchableOpacity 
                onPress={() => this.state.isButtonsTouchable && this.chooseOption(0)} 
                style={[styles.optionContainer, styles.firstOptionContainer]}>
                <Animated.View style={[styles.optionAnimatedViewContainer, {backgroundColor: this.firstButtonColorInterpolate()}]}>
                  <Text style={styles.optionText}>{this.props.children.options[0]}</Text>
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => this.state.isButtonsTouchable && this.chooseOption(1)} 
                style={[styles.optionContainer, styles.secondOptionContainer]}>
                <Animated.View style={[styles.optionAnimatedViewContainer, {backgroundColor: this.secondButtonColorInterpolate()}]}>
                  <Text style={styles.optionText}>{this.props.children.options[1]}</Text>
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => this.state.isButtonsTouchable && this.chooseOption(2)} 
                style={[styles.optionContainer, styles.thirdOptionContainer]}>
                <Animated.View style={[styles.optionAnimatedViewContainer, {backgroundColor: this.thirdButtonColorInterpolate()}]}>
                  <Text style={styles.optionText}>{this.props.children.options[2]}</Text>
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => this.state.isButtonsTouchable && this.chooseOption(3)} 
                style={[styles.optionContainer, styles.fourthOptionContainer]}>
                <Animated.View style={[styles.optionAnimatedViewContainer, {backgroundColor: this.fourthButtonColorInterpolate()}]}>
                  <Text style={styles.optionText}>{this.props.children.options[3]}</Text>
                </Animated.View>
              </TouchableOpacity>

            </View>
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
  questionContainer: {
    width: '100%', 
    height: '65%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addToFavoritesContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 35,
    height: 35,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  },
  addToFavoritesText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '500',
    fontSize: 18
  },
  questionText: {
    fontSize: 35,
    fontWeight: 'bold'
  },
  optionsContainer: {
    width: '100%', 
    height: '35%', 
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  optionContainer: {
    width: '50%', 
    height: '50%',
    borderWidth: 4,
    borderColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionAnimatedViewContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontWeight: "500"
  },
  firstOptionContainer: {
    borderLeftWidth: 0,
    borderBottomWidth: 0
  },
  secondOptionContainer: {
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0
  },
  thirdOptionContainer: {
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  fourthOptionContainer: {
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0
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
