import * as types from '../types';

const INITIAL_STATE = {
  current: null,
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
    default:
      return state
  }
};

