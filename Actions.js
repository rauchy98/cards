import * as types from './types'

export class Actions {
    static setCollection(collectionName) {
        return {
            type: types.SET_COLLECTION,
            collectionName
        }
    }

    static setMode(mode) {
        return {
            type: types.SET_MODE,
            mode
        }
    }


    static addToFavorites(question, answer) {
        return {
            type: types.ADD_TO_FAVORITES,
            question,
            answer
        }
    }

    static removeCardFromCollection(collectionName, question) {
        return {
            type: types.REMOVE_CARD_FROM_COLLECTION,
            collectionName,
            question
        }
    }


    static resetCollection() {
        return {
            type: types.RESET_COLLECTION
        }
    }

    static resetMode() {
        return {
            type: types.RESET_MODE
        }
    }
}