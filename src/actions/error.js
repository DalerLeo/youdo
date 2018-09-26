import * as actionTypes from '../constants/actionTypes'

export const openErrorAction = (payload) => {
  return {
    type: actionTypes.ERROR_OPEN,
    payload
  }
}

export const closeErrorAction = () => {
  return {
    type: actionTypes.ERROR_CLOSE
  }
}
