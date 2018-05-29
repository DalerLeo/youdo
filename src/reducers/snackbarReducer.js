import * as actionTypes from '../constants/actionTypes'
import createReducer from '../helpers/createReducer'

export const defaultState = {
  open: false,
  message: 'Message',
  autoHideDuration: 3000
}

const snackbarReducer = () => {
  return createReducer(defaultState, {
    [`${actionTypes.SNACKBAR_OPEN}`] (state, {payload}) {
      return {
        ...state,
        ...payload,
        open: true
      }
    },

    [`${actionTypes.SNACKBAR_CLOSE}`] (state) {
      return {
        ...state,
        open: false
      }
    }
  })
}

export default snackbarReducer
