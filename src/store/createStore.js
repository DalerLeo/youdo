import {createStore, applyMiddleware} from 'redux'
import {routerMiddleware} from 'react-router-redux'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import {hashHistory} from 'react-router'
import rootReducer from '../reducers'

export default (initialState) => {
  const middleware = [
    promiseMiddleware(),
    thunkMiddleware,
    routerMiddleware(hashHistory)
  ]

  if (process.env.NODE_ENV === 'development') {
    const createLogger = require('redux-logger')
    middleware.push(createLogger())
  }

  return createStore(rootReducer, initialState, applyMiddleware(...middleware))
}
