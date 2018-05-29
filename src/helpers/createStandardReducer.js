import createReducer from './createReducer'

const createStandardReducer = (actionName) => {
  return createReducer({
    data: null,
    loading: false
  }, {
    [actionName] (state, action) {
      return {...state, data: action.data, loading: action.loading}
    }
  })
}

export default createStandardReducer
