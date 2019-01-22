import React, { Component } from 'react'
import Swiper from './Swiper'
import { Button, StyleSheet, Text, View, Platform, Dimensions, PanResponder, Animated, Easing } from 'react-native'
import CardWrapper from './CardWrapper';
import { REPEAT, LEARNED } from './constants';
import _ from 'lodash';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const { height, width } = Dimensions.get('window');

export default class DeckWrapper extends Component {

  state = {
    dx: new Animated.Value(0),
    backgroundText: 'Hello',
    backgroundTextOpacity: new Animated.Value(0),
    deck: [],
    repeat: [],
    swipeText: '',
    swipeTextOpacity: new Animated.Value(0),
  };

  componentWillMount() {
      this.setState({
          deck: _.shuffle(this.props.deck)
      })
  }

  componentDidMount() {
    Animated.timing(this.state.backgroundTextOpacity, {
        toValue: 1,
        duration: 700,
        ActiveNativeDriver: true,
      }).start()
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

  cardSwiped = (cardId, result) => {
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
                this.setState({
                    deck: _.shuffle(repeat),
                    repeat: []
            })
        }
        else if (this.state.deck.length === 0 && repeat.length === 0) {

        Animated.timing(this.state.backgroundTextOpacity, {
            toValue: 0,
            duration: 250,
            ActiveNativeDriver: true,
          }).start(() => {
            this.setState({
                backgroundText: `That's all`
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

  render () {
    return (
        <View style={styles.container}>

          <Animated.Text 
            style={[styles.doneText, {opacity: this.state.backgroundTextOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
            }) }] }>{this.state.backgroundText}</Animated.Text>

            {
          this.state.deck.map((card, index) => 
            <CardWrapper 
            showResult={this.showResult}
            cardSwiped={this.cardSwiped} 
            general={index === this.state.deck.length - 1 ? true : false} 
            key={card.id} 
            index={index}>
                {card}
            </CardWrapper>
          )
            }

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
    flex: 1,
    // backgroundColor: '#f0f0f0'
  },
  text: {
    textAlign: 'center',
    fontSize: 50,
    backgroundColor: 'transparent'
  },
  doneText: {
    position: 'absolute',
    textAlign: 'center',
    fontSize: 20,
    color: 'grey'
  },
  swipeText: {
    position: 'absolute',
    top: height * 0.13,
    fontSize: 35,
    fontWeight: 'bold',
    color: 'grey'
  },
})
