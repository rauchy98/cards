import * as types from '../types';
import { CLASSIC_MODE, TESTING_MODE, WRITING_MODE } from '../constants';

const INITIAL_STATE = {
  selectedMode: null,
  isModeSelected: false,
  modes: [CLASSIC_MODE, TESTING_MODE, WRITING_MODE]
};

export const modeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_MODE: {
        const selectedMode = state.modes.find(mode => mode === action.mode);
        if (selectedMode) {
            return {...state, selectedMode, isModeSelected: true}
        }
    }
    case types.RESET_MODE: {
        return {...state, selectedMode: null, isModeSelected: false}
    }
    default:
      return state
  }
};

