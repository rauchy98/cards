import React, { Component } from 'react'
import { REPEAT, LEARNED, CARD_SIZE_MULTIPLIER, ANOTHER_CARD_SIZE_MULTIPLIER } from './constants'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

export default class WritingCard extends Component {

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
      animatedTextInput: new Animated.Value(0),
      radius: 200,
      isInRadius: 0
    };
  }

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

  colorInterpolate = {
    inputRange: [-1, 0, 1],
    outputRange: ['rgba(124, 255, 117, 0.5)','#F0F0F0', 'rgba(255, 117, 117, 0.5)']
  };

  animatedTextInputColorInterpolate = () => this.state.animatedTextInput.interpolate(this.colorInterpolate);

  onSubmit = (e) => {
    const userAnswer = e.nativeEvent.text;
    if (userAnswer === this.props.children.answer) {
      Animated.sequence([
        Animated.timing(this.state.animatedTextInput, {
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
        Animated.timing(this.state.animatedTextInput, {
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

            <Animated.View style={[styles.textInputAnimatedContainer, {backgroundColor: this.animatedTextInputColorInterpolate()}]}><TextInput onSubmitEditing={this.onSubmit} placeholder="Enter your answer here" style={styles.textInputAnswer}></TextInput></Animated.View>

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
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  textInputAnimatedContainer: {
    width: width * 0.7,
    borderRadius: 50,
  },
  textInputAnswer: {
    textAlign: 'center',
    fontSize: 18
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
