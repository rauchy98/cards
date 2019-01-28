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