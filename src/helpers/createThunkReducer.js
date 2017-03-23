import createReducer from './createReducer'

const defaultState = {
    data: null,
    error: null,
    loading: false,
    failed: false
}

const createThunkReducer = (actionName) => {
    return createReducer(defaultState, {
        [`${actionName}_PENDING`] (state, action) {
            return {
                ...state,
                loading: true
            }
        },
        [`${actionName}_FULFILLED`] (state, action) {
            return {
                ...state,
                data: action.payload,
                error: null,
                loading: false,
                failed: false
            }
        },
        [`${actionName}_REJECTED`] (state, action) {
            return {
                ...state,
                data: null,
                error: action.payload,
                loading: false,
                failed: true
            }
        },
        [`${actionName}_CLEAR`] () {
            return defaultState
        }
    })
}

export default createThunkReducer
