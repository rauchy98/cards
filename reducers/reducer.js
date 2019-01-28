import { combineReducers } from 'redux';
import { collectionsReducer } from './collections.reducer';
import { modeReducer } from './mode.reducer';

export default combineReducers({
    collectionsStore: collectionsReducer,
    modesStore: modeReducer
});