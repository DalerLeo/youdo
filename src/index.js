import React from 'react'
import ReactDOM from 'react-dom'
import Rx from 'rxjs'
import rxjsconfig from 'recompose/rxjsObservableConfig'
import {setObservableConfig} from 'recompose'
import {hashHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'
import createStore from './store/createStore'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import './styles'
const store = createStore()
const history = syncHistoryWithStore(hashHistory, store)

setObservableConfig({
  // Converts a plain ES observable to an RxJS 5 observable
  fromESObservable: Rx.Observable.from
})
setObservableConfig(rxjsconfig)

const MOUNT_NODE = document.getElementById('wrapper')

const render = () => {
  const App = require('../src/containers/App/App').default
  ReactDOM.render(
    <App
      store={store}
      history={history}
    />,
    MOUNT_NODE
  )
}

if (module.hot) {
  module.hot.accept(['../src/containers/App/App'], () => {
    setImmediate(() => {
      ReactDOM.unmountComponentAtNode(MOUNT_NODE)
      render()
    })
  })
}

render()
