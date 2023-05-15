import { SET_EVA_INFO, SET_SELECTOR } from "../actions/type"

const INITIAL_STATE = {
  selectorInfo: {},
}

export default function counter(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SELECTOR:
      return {
        ...state,
        selectorInfo: action.payload
      }
    case SET_EVA_INFO:
      return {
        ...state,
        evaInfo: action.payload
      }
    default:
      return state
  }
}