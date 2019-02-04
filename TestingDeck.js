import React, { Component } from 'react'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing } from 'react-native'
import TestingCard from './TestingCard';
import { REPEAT, LEARNED, SWIPE_TEXT_MULTIPLIER_16_9, SWIPE_TEXT_MULTIPLIER_18_9 } from './constants';
import _ from 'lodash';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

const SWIPE_TEXT_MULTIPLIER = height / width === 16 / 9 ? SWIPE_TEXT_MULTIPLIER_16_9 : SWIPE_TEXT_MULTIPLIER_18_9;

export default class TestingDeck extends Component {

  state = {
    dx: new Animated.Value(0),
    backgroundText: 'Hello',
    backgroundTextOpacity: new Animated.Value(0),
    deck: [],
    repeat: [],
    swipeText: '',
    swipeTextOpacity: new Animated.Value(0),
    initializeAnimation: false,
    deckTop: new Animated.Value(height / 2),
    deckOpacity: new Animated.Value(0),
    isInitializedDeckAnimation: false
  };

  componentWillMount() {
      const deck = _.clone(this.props.deck);
      const answers = [];
      deck.map(card => answers.push(card.answer));

      const newDeck = deck.map(card => { 
          const answersForCard = answers.filter(answer => answer !== card.answer);
          _.shuffle(answersForCard);
          return {...card, options: _.shuffle([card.answer, answersForCard[1], answersForCard[2], answersForCard[3]]) } 
        })
      
      this.setState({
          deck: _.shuffle(newDeck)
      })
  }

  componentDidMount() {
    Animated.timing(this.state.backgroundTextOpacity, {
        toValue: 1,
        duration: 300,
        ActiveNativeDriver: true,
      }).start()

      this.initializeDeckAnimation();
  }

  initializeDeckAnimation() {
    Animated.parallel([
      Animated.timing(this.state.deckTop, {
        toValue: 0,
        duration: 700,
        ActiveNativeDriver: true,
      }),
      Animated.timing(this.state.deckOpacity, {
        toValue: 1,
        duration: 700,
        ActiveNativeDriver: true,
      })
    ]).start(res => {
      this.setState({isInitializedDeckAnimation: true})
    });
  }

  showResult = (result) => {
    this.setState({
      swipeText: result
    }, () => {
      Animated.sequence([
        Animated.timing(this.state.swipeTextOpacity, {
          toValue: 1,
          duration: 300,
          ActiveNativeDriver: true
        }),
        Animated.timing(this.state.swipeTextOpacity, {
          delay: 300,
          toValue: 0,
          duration: 300,
          ActiveNativeDriver: true
        })    
      ]).start()
    })
  }

  optionChoosed = (cardId, result) => {
    const deck = this.state.deck;
    const cardIndex = deck.findIndex(card => card.id === cardId);
    const repeat = this.state.repeat;

    if (result === REPEAT) {
        const card = deck[cardIndex];
        repeat.unshift(card);

        if (this.state.backgroundText === `You have not learned worlds. Move on`) {
            this.setState({
                repeat
            })
        }
        else {
            Animated.timing(this.state.backgroundTextOpacity, {
                toValue: 0,
                duration: 250,
                ActiveNativeDriver: true,
              }).start(() => {
                this.setState({
                    repeat,
                    backgroundText: `You have not learned worlds. Move on`
                }, () => {
                    Animated.timing(this.state.backgroundTextOpacity, {
                        toValue: 1,
                        duration: 250,
                        ActiveNativeDriver: true,
                      }).start();
                })
              });
        }
    }

    deck.splice(cardIndex, 1);

    this.setState({
        deck
    }, () => {
        if (this.state.deck.length === 0 && repeat.length > 0) {

            Animated.parallel([
              Animated.timing(this.state.deckTop, {
                toValue: height / 2,
                duration: 0,
                ActiveNativeDriver: true,
              }),
              Animated.timing(this.state.deckOpacity, {
                  toValue: 0,
                  duration: 0,
                  ActiveNativeDriver: true,
                })
            ]).start(res => {
              this.setState({
                deck: _.shuffle(repeat),
                repeat: [],
                isInitializedDeckAnimation: false
              }, () => {
                this.initializeDeckAnimation();
              });
            })
        }
        else if (this.state.deck.length === 0 && repeat.length === 0) {

        Animated.timing(this.state.backgroundTextOpacity, {
            toValue: 0,
            duration: 250,
            ActiveNativeDriver: true,
          }).start(() => {
            this.setState({
                backgroundText: `Good job!`
            }, () => {
                Animated.timing(this.state.backgroundTextOpacity, {
                    toValue: 1,
                    duration: 250,
                    ActiveNativeDriver: true,
                  }).start();
            })
          });
        }
    })
  }

  renderCards = () => 
    {
      return this.state.deck.map((card, index) => 
        <TestingCard 
        optionChoosed={this.optionChoosed}
        showResult={this.showResult}
        cardSwiped={this.cardSwiped} 
        general={index === this.state.deck.length - 1 ? true : false} 
        key={card.id} 
        index={index}>
            {card}
        </TestingCard>
      )
  }
  
  renderCardsWithAnimatedWrapper = () => (
    <Animated.View style={[styles.animatedContainer, {top: this.state.deckTop, opacity: this.state.deckOpacity}]}>
      {this.renderCards()}
    </Animated.View>
  )

  render () {
    return (
        <View style={styles.container}>

          <Animated.Text 
            style={[styles.doneText, {opacity: this.state.backgroundTextOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
            }) }] }>{this.state.backgroundText}</Animated.Text>

            {!this.state.isInitializedDeckAnimation ? this.renderCardsWithAnimatedWrapper() : this.renderCards()}

            <Animated.Text 
            style={[styles.swipeText, 
            {opacity: this.state.swipeTextOpacity }] }>{this.state.swipeText}</Animated.Text>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  animatedContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  },
  doneText: {
    width: width * 0.9,
    position: 'absolute',
    textAlign: 'center',
    fontSize: 20,
    color: 'grey',
  },
  swipeText: {
    position: 'absolute',
    top: width * SWIPE_TEXT_MULTIPLIER,
    fontSize: 35,
    fontWeight: 'bold',
    color: 'grey'
  },
})
