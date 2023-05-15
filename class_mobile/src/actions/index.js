import { SET_EVA_INFO, SET_SELECTOR } from './type'

export const setSelectorInfo = (data) => (dispatch) => {
  dispatch({
    type: SET_SELECTOR,
    payload: data
  });
}

export const setEvaInfo = (data) => (dispatch) => {
  dispatch({
    type: SET_EVA_INFO,
    payload: data
  });
}