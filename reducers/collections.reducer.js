import * as types from '../types';
import _ from 'lodash'

const INITIAL_STATE = {
  current: null,
  message: '',
  isCollectionSelected: false,
  collections: [
        {
            name: 'Fruits',
            deck: [
                {id: 1, question: 'Apple', answer: 'Яблуко'},
                {id: 2, question: 'Blackberry', answer: 'Ожина'},
                {id: 3, question: 'Melon', answer: 'Диня'},
                {id: 4, question: 'Peach', answer: 'Персик'},
                {id: 5, question: 'Redcurrant', answer: 'Смородина'},
                {id: 6, question: 'Pomegranate', answer: 'Гранат'},
                {id: 7, question: 'Plum', answer: 'Слива'} ]
        },
        {
            name: 'Kitchen',
            deck: [
                {id: 1, question: 'Freezer', answer: 'Морозилка'},
                {id: 2, question: 'Sink', answer: 'Мийка'},
                {id: 3, question: 'Refrigerator', answer: 'Холодильник'},
                {id: 4, question: 'Oven', answer: 'Духовка'},
                {id: 5, question: 'Teapot', answer: 'Чайник'},
                {id: 6, question: 'Napkin', answer: 'Салфетка'},
                {id: 7, question: 'Pot', answer: 'Кастрюля'} ]
        }
    ]
};

export const collectionsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_COLLECTION: {
        const collection = state.collections.find(collection => collection.name === action.collectionName);
        if (collection) {
            return {...state, current: collection, isCollectionSelected: true}
        }
    }
    case types.RESET_COLLECTION: {
        return {...state, current: null, isCollectionSelected: false}
    }
    case types.ADD_TO_FAVORITES: {
        const collections = state.collections;
        const favoritesCollection = collections.find(collection => collection.name === 'Favorites');
        if (favoritesCollection) {
            const favoritesCollectionIndex = collections.findIndex(collection => collection.name === 'Favorites');
            if (collections[favoritesCollectionIndex].deck.find(card => card.question === action.question)) {
                return { ...state, message: `You already have ${action.question} card in favorites` }
            }
            const id = collections[favoritesCollectionIndex].deck.length + 1;
            collections[favoritesCollectionIndex].deck.push({id, question: action.question, answer: action.answer});
        }
        else {
            collections.push({
                name: 'Favorites',
                deck: [{
                    id: 1, question: action.question, answer: action.answer
                }]
            })
        }
        return {...state, collections: _.clone(collections), message: `You successfully have added ${action.question} card to favorites`}
    }
    case types.REMOVE_CARD_FROM_COLLECTION: {
        const collections = state.collections;
        const favoritesCollection = collections.find(collection => collection.name === action.collectionName);
        if (favoritesCollection) {
            const favoritesCollectionIndex = collections.findIndex(collection => collection.name === action.collectionName);
            const cardIndex = collections[favoritesCollectionIndex].deck.findIndex(card => card.question === action.question);
            if (cardIndex !== -1) {
                const currentCard = collections[favoritesCollectionIndex].deck[cardIndex];
                collections[favoritesCollectionIndex].deck.splice(cardIndex, 1);

                if (collections[favoritesCollectionIndex].deck.length === 0) {
                    collections.splice(favoritesCollectionIndex, 1);
                    return {...state, collections: _.clone(collections), message: `You successfully have removed ${currentCard.question} card`}
                }
                if (favoritesCollection.name === state.current.name) {
                    return {...state, collections, current: _.clone(collections[favoritesCollectionIndex]), message: `You successfully have removed '${currentCard.question}' card`}
                }
                else {
                    return {...state, collections, message: `You successfully have removed ${currentCard.question} card`}
                }
            }
        }
        else {
            return state;
        }
    }
    default:
      return state
  }
};

