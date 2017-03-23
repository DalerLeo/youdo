import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import {Router, hashHistory} from 'react-router'
import ReduxToastr from 'react-redux-toastr'
import {syncHistoryWithStore} from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin'

import createStore from './store/createStore'
import routes from './routes'

import './styles'

const store = createStore()
const history = syncHistoryWithStore(hashHistory, store)

injectTapEventPlugin()

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider>
            <div style={{width: '100%', height: '100%'}}>
                <Router history={history} routes={routes} />
                <ReduxToastr
                    timeOut={4000}
                    newestOnTop={false}
                    preventDuplicates={true}
                    position="bottom-left"
                    transitionIn="fadeIn"
                    transitionOut="fadeOut"
                    progressBar/>
            </div>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('wrapper')
)
