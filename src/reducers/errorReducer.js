import * as actionTypes from '../constants/actionTypes'
import errorDialog from '../helpers/openErrorDialog'

export const defaultState = {
  open: false,
  message: 'Ошибка соединения с базой!'
}

const errorReducer = () => {
  return errorDialog(defaultState, {
    [`${actionTypes.ERROR_OPEN}`] (state, {payload}) {
      return {
        ...state,
        ...payload,
        open: true
      }
    },

    [`${actionTypes.ERROR_CLOSE}`] (state) {
      return {
        ...state,
        open: false
      }
    }
  })
}

export default errorReducer
