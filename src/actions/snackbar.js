import * as actionTypes from '../constants/actionTypes'

export const openSnackbarAction = (payload) => {
  return {
    type: actionTypes.SNACKBAR_OPEN,
    payload
  }
}

export const closeSnackbarAction = () => {
  return {
    type: actionTypes.SNACKBAR_CLOSE
  }
}
